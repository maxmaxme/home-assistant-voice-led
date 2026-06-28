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

function hash(a: number, b: number): number {
  const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453
  return x - Math.floor(x)
}

function hsv(h: number, s: number, v: number): RGB {
  const i = Math.floor(h * 6)
  const f = h * 6 - i
  const p = v * (1 - s)
  const q = v * (1 - f * s)
  const t = v * (1 - (1 - f) * s)
  const [r, g, b] = [
    [v, t, p], [q, v, p], [p, v, t], [p, q, v], [t, p, v], [v, p, q],
  ][i % 6]
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) }
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
    case 'twinkle': {
      const frame = Math.floor(timeMs / 120)
      return hash(index, frame) < d.probability ? d.color : BLACK
    }
    case 'rainbow':
      return hsv(((index / LED_COUNT) + timeMs / 4000) % 1, 1, 1)
    case 'mute': {
      if (d.muted && (index === 3 || index === 9)) return { r: 255, g: 0, b: 0 }
      if (d.silent && (index === 6 || index === 7)) return { r: 255, g: 0, b: 0 }
      return d.color
    }
    case 'volume': {
      if (d.level === 0 && index === 6) return { r: 255, g: 0, b: 0 }
      const lit = Math.round(d.level * LED_COUNT)
      return index < lit ? d.color : BLACK
    }
    default:
      return BLACK
  }
}
