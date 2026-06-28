import { describe, it, expect } from 'vitest'
import { CATALOG } from '../../app/utils/leds/catalog'
import { ledColor } from '../../app/utils/leds/engine'

describe('catalog', () => {
  it('covers the expected states', () => {
    const ids = CATALOG.map(e => e.id).sort()
    expect(ids).toEqual(
      ['error', 'idle', 'listening', 'mute', 'replying', 'thinking', 'volume', 'waiting'].sort(),
    )
  })
  it('every entry renders a valid color at t=0', () => {
    for (const e of CATALOG) {
      const c = ledColor(0, 0, e.descriptor)
      for (const ch of [c.r, c.g, c.b]) {
        expect(ch).toBeGreaterThanOrEqual(0)
        expect(ch).toBeLessThanOrEqual(255)
      }
    }
  })
})
