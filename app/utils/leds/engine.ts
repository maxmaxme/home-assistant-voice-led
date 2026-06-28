import type { PreviewDescriptor, RGB } from './types'
import { LED_COUNT } from './types'

const BLACK: RGB = { r: 0, g: 0, b: 0 }

function scale(c: RGB, k: number): RGB {
  const kk = Math.max(0, Math.min(1, k))
  return { r: Math.round(c.r * kk), g: Math.round(c.g * kk), b: Math.round(c.b * kk) }
}

function step(timeMs: number, speed: number): number {
  return Math.floor(timeMs / (100 / speed))
}

function ringDist(a: number, b: number): number {
  const d = Math.abs(a - b)
  return Math.min(d, LED_COUNT - d)
}

export function ledColor(index: number, timeMs: number, d: PreviewDescriptor): RGB {
  switch (d.type) {
    case 'solid': {
      const hit = d.indicators.find(i => i.index === index)
      return hit ? hit.color : d.color
    }
    case 'rotate': {
      const frame = step(timeMs, d.speed)
      let head = ((frame % LED_COUNT) + LED_COUNT) % LED_COUNT
      if (d.direction === 'ccw') head = (LED_COUNT - head) % LED_COUNT
      const behind = ((head - index) % LED_COUNT + LED_COUNT) % LED_COUNT
      if (behind === 0) return scale(d.color, d.brightness)
      if (d.tail > 0 && behind <= d.tail) {
        const k = (1 - behind / (d.tail + 1)) * d.brightness
        return scale(d.color, k)
      }
      return BLACK
    }
    case 'pulse': {
      const frame = step(timeMs, d.speed)
      const phase = (frame % 20) / 20
      const tri = phase < 0.5 ? phase * 2 : (1 - phase) * 2
      const k = d.minBrightness + (1 - d.minBrightness) * tri
      if (d.mode === 'full') return scale(d.color, k)
      const head = frame % LED_COUNT
      if (d.mode === 'single') return index === head ? scale(d.color, k) : BLACK
      return index === head || index === (head + LED_COUNT / 2) % LED_COUNT ? scale(d.color, k) : BLACK
    }
    case 'wave': {
      const frame = step(timeMs, d.speed)
      const reach = d.direction === 'out' ? frame % 7 : 6 - (frame % 7)
      return ringDist(index, 0) === reach ? d.color : BLACK
    }
    default:
      return BLACK
  }
}
