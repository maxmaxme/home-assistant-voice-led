import { describe, it, expect } from 'vitest'
import type { MuteEffect, VolumeEffect, RainbowEffect, TwinkleEffect } from '../../app/utils/leds/types'
import { ledColor } from '../../app/utils/leds/engine'

const C = { r: 10, g: 200, b: 50 }
const RED = { r: 255, g: 0, b: 0 }

describe('engine mute', () => {
  const m: MuteEffect = { type: 'mute', color: C, muted: true, silent: false }
  it('marks leds 3 and 9 red when muted', () => {
    expect(ledColor(3, 0, m)).toEqual(RED)
    expect(ledColor(9, 0, m)).toEqual(RED)
    expect(ledColor(0, 0, m)).toEqual(C)
  })
})

describe('engine volume', () => {
  it('lights the first N leds for the level', () => {
    const v: VolumeEffect = { type: 'volume', color: C, level: 0.5 }
    expect(ledColor(0, 0, v)).toEqual(C)
    expect(ledColor(5, 0, v)).toEqual(C)
    expect(ledColor(11, 0, v)).toEqual({ r: 0, g: 0, b: 0 })
  })
  it('shows red on led 6 at zero level', () => {
    const v: VolumeEffect = { type: 'volume', color: C, level: 0 }
    expect(ledColor(6, 0, v)).toEqual(RED)
  })
})

describe('engine rainbow + twinkle', () => {
  it('rainbow returns a non-black color', () => {
    const rb: RainbowEffect = { type: 'rainbow', width: 12 }
    const c = ledColor(0, 0, rb)
    expect(c.r + c.g + c.b).toBeGreaterThan(0)
  })
  it('twinkle is deterministic for the same index/time', () => {
    const t: TwinkleEffect = { type: 'twinkle', color: C, probability: 0.5 }
    expect(ledColor(4, 700, t)).toEqual(ledColor(4, 700, t))
  })
})
