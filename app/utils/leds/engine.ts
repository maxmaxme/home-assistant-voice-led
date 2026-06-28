import type { PreviewDescriptor, RGB } from './types'

const BLACK: RGB = { r: 0, g: 0, b: 0 }

export function ledColor(index: number, timeMs: number, d: PreviewDescriptor): RGB {
  switch (d.type) {
    case 'solid': {
      const hit = d.indicators.find(i => i.index === index)
      return hit ? hit.color : d.color
    }
    default:
      return BLACK
  }
}
