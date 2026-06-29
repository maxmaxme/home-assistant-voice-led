import { describe, it, expect } from 'vitest'
import type { RotateEffect, PulseEffect, WaveEffect } from '../../app/utils/leds/types'
import { ledColor } from '../../app/utils/leds/engine'

const C = { r: 100, g: 100, b: 100 }

describe('engine rotate', () => {
  const rot: RotateEffect = { type: 'rotate', color: C, speed: 1, direction: 'cw', tail: 0, brightness: 1 }
  it('lights the head led at frame 0 and leaves others dark with no tail', () => {
    expect(ledColor(0, 0, rot)).toEqual({ ...C, a: 1 })
    expect(ledColor(1, 0, rot)).toEqual({ r: 0, g: 0, b: 0, a: 0 })
  })
  it('advances the head by one led after one step', () => {
    expect(ledColor(1, 100, rot)).toEqual({ ...C, a: 1 })
    expect(ledColor(0, 100, rot)).toEqual({ r: 0, g: 0, b: 0, a: 0 })
  })
})

describe('engine pulse full', () => {
  const p: PulseEffect = { type: 'pulse', color: C, speed: 1, mode: 'full', minBrightness: 0 }
  it('drives every led to the same brightness at a given time', () => {
    const t = 250
    const a = ledColor(0, t, p)
    for (let i = 1; i < 12; i++) expect(ledColor(i, t, p)).toEqual(a)
  })
})

describe('engine wave', () => {
  const w: WaveEffect = { type: 'wave', color: C, speed: 1, direction: 'out' }
  it('is mirror-symmetric across the ring', () => {
    const t = 180
    for (let i = 1; i < 6; i++) {
      expect(ledColor(i, t, w)).toEqual(ledColor((12 - i) % 12, t, w))
    }
  })
})
