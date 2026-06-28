import { describe, it, expect } from 'vitest'
import type { SolidEffect } from '../../app/utils/leds/types'
import { ledColor } from '../../app/utils/leds/engine'

const base: SolidEffect = {
  type: 'solid',
  color: { r: 10, g: 20, b: 30 },
  indicators: [{ index: 3, color: { r: 255, g: 0, b: 0 } }],
}

describe('engine solid', () => {
  it('paints base color on a normal led', () => {
    expect(ledColor(0, 0, base)).toEqual({ r: 10, g: 20, b: 30 })
  })
  it('overrides indicator leds regardless of time', () => {
    expect(ledColor(3, 1234, base)).toEqual({ r: 255, g: 0, b: 0 })
  })
})
