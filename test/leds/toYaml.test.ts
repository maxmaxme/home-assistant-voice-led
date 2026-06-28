import { describe, it, expect } from 'vitest'
import type { RotateEffect, RainbowEffect } from '../../app/utils/leds/types'
import { toYaml } from '../../app/utils/leds/toYaml'

describe('toYaml', () => {
  it('emits a self-contained addressable_lambda for rotate', () => {
    const r: RotateEffect = { type: 'rotate', color: { r: 255, g: 0, b: 0 }, speed: 1, direction: 'cw', tail: 3, brightness: 1 }
    const y = toYaml(r, 'My Effect')
    expect(y).toContain('- addressable_lambda:')
    expect(y).toContain('name: "My Effect"')
    expect(y).toContain('Color base(255, 0, 0)')
    expect(y).toContain('static int frame')
    expect(y).not.toContain('global_led_animation_index')
    expect(y).not.toContain('led_ring')
  })
  it('emits a builtin block for rainbow', () => {
    const rb: RainbowEffect = { type: 'rainbow', width: 12 }
    const y = toYaml(rb, 'Rainbow')
    expect(y).toContain('- addressable_rainbow:')
    expect(y).toContain('width: 12')
  })
})
