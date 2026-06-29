import { describe, it, expect } from 'vitest'
import type { BreathingEffect } from '../../app/utils/leds/types'
import { ledColor } from '../../app/utils/leds/engine'
import { toYaml } from '../../app/utils/leds/toYaml'

const breathing: BreathingEffect = {
  type: 'breathing',
  color: { r: 24, g: 187, b: 242 },
  speed: 1,
  minBrightness: 0,
}

describe('engine breathing', () => {
  it('drives the whole ring to the same brightness at a given time', () => {
    const t = 1500
    const a = ledColor(0, t, breathing)
    for (let i = 1; i < 12; i++) expect(ledColor(i, t, breathing)).toEqual(a)
  })

  it('is dark at the start of the cycle and full at the peak', () => {
    expect(ledColor(0, 0, breathing)).toEqual({ r: 0, g: 0, b: 0 })
    expect(ledColor(0, 3000, breathing)).toEqual({ r: 24, g: 187, b: 242 })
  })
})

describe('toYaml breathing', () => {
  it('emits a self-contained breathing lambda', () => {
    const y = toYaml(breathing, 'Breathe')
    expect(y).toContain('- addressable_lambda:')
    expect(y).toContain('name: "Breathe"')
    expect(y).toContain('cosf')
    expect(y).toContain('static int frame')
    expect(y).not.toContain('global_led_animation_index')
    expect(y).not.toContain('led_ring')
  })
})
