import { describe, it, expect } from 'vitest'
import type { MuteEffect, VolumeEffect, RainbowEffect, TwinkleEffect } from '../../app/utils/leds/types'
import { ledColor } from '../../app/utils/leds/engine'

const C = { r: 10, g: 200, b: 50 }
const RED = { r: 255, g: 0, b: 0 }

describe('engine mute', () => {
  const m: MuteEffect = { type: 'mute', color: C, muted: true, silent: false }
  it('marks leds 3 and 9 red when muted', () => {
    expect(ledColor(3, 0, m)).toEqual({ ...RED, a: 1 })
    expect(ledColor(9, 0, m)).toEqual({ ...RED, a: 1 })
    expect(ledColor(0, 0, m)).toEqual({ ...C, a: 1 })
  })
})

describe('engine volume', () => {
  it('lights the first N leds for the level', () => {
    const v: VolumeEffect = { type: 'volume', color: C, level: 0.5 }
    expect(ledColor(0, 0, v)).toEqual({ ...C, a: 1 })
    expect(ledColor(5, 0, v)).toEqual({ ...C, a: 1 })
    expect(ledColor(11, 0, v)).toEqual({ r: 0, g: 0, b: 0, a: 0 })
  })
  it('shows red on led 6 at zero level', () => {
    const v: VolumeEffect = { type: 'volume', color: C, level: 0 }
    expect(ledColor(6, 0, v)).toEqual({ ...RED, a: 1 })
  })
})

describe('engine rainbow + twinkle', () => {
  it('rainbow returns a non-black color', () => {
    const rb: RainbowEffect = { type: 'rainbow', width: 12 }
    const c = ledColor(0, 0, rb)
    expect(c.r + c.g + c.b).toBeGreaterThan(0)
  })
  it('rainbow hue differs across leds when width is small', () => {
    // With width=4 the hue increments by 1/4 per LED, so leds 0 and 1 produce different hues
    const rb: RainbowEffect = { type: 'rainbow', width: 4 }
    const c0 = ledColor(0, 0, rb)
    const c1 = ledColor(1, 0, rb)
    expect(c0).not.toEqual(c1)
  })
  it('rainbow produces different colors for different widths at same index/time', () => {
    const narrow: RainbowEffect = { type: 'rainbow', width: 1 }
    const wide: RainbowEffect = { type: 'rainbow', width: 12 }
    // At index=6, the hue offset differs between width=1 and width=12
    const cn = ledColor(6, 0, narrow)
    const cw = ledColor(6, 0, wide)
    expect(cn).not.toEqual(cw)
  })
  it('twinkle is deterministic for the same index/time', () => {
    const t: TwinkleEffect = { type: 'twinkle', color: C, probability: 0.5 }
    expect(ledColor(4, 700, t)).toEqual(ledColor(4, 700, t))
  })
})
