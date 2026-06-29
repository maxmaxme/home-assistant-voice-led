import type { PreviewDescriptor, RGB, RGBA } from './types'
import { LED_COUNT } from './types'

const OFF: RGBA = { r: 0, g: 0, b: 0, a: 0 }
const RED: RGB = { r: 255, g: 0, b: 0 }

// A lit LED keeps its full hue; a pure-black color means the LED is off.
function lit(c: RGB, a = 1): RGBA {
  const on = c.r + c.g + c.b > 0
  return { r: c.r, g: c.g, b: c.b, a: on ? a : 0 }
}

// A dimmed LED keeps its hue and fades via alpha (so it reads as a faint glow,
// not a dark dot, over the white device).
function dim(c: RGB, k: number): RGBA {
  return { r: c.r, g: c.g, b: c.b, a: Math.max(0, Math.min(1, k)) }
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

export function ledColor(index: number, timeMs: number, d: PreviewDescriptor): RGBA {
  switch (d.type) {
    case 'solid': {
      const hit = d.indicators.find(i => i.index === index)
      return lit(hit ? hit.color : d.color)
    }
    case 'rotate': {
      const frame = step(timeMs, d.speed)
      let head = ((frame % LED_COUNT) + LED_COUNT) % LED_COUNT
      if (d.direction === 'ccw') head = (LED_COUNT - head) % LED_COUNT
      const behind = ((head - index) % LED_COUNT + LED_COUNT) % LED_COUNT
      if (behind === 0) return dim(d.color, d.brightness)
      if (d.tail > 0 && behind <= d.tail) {
        const k = (1 - behind / (d.tail + 1)) * d.brightness
        return dim(d.color, k)
      }
      return OFF
    }
    case 'pulse': {
      const frame = step(timeMs, d.speed)
      const phase = (frame % 20) / 20
      const tri = phase < 0.5 ? phase * 2 : (1 - phase) * 2
      const k = d.minBrightness + (1 - d.minBrightness) * tri
      if (d.mode === 'full') return dim(d.color, k)
      // single/dual spots pulse in place (they do not rotate around the ring).
      const a = 1
      const b = a + LED_COUNT / 2
      if (d.mode === 'single') return index === a ? dim(d.color, k) : OFF
      return index === a || index === b ? dim(d.color, k) : OFF
    }
    case 'wave': {
      const frame = step(timeMs, d.speed)
      const reach = d.direction === 'out' ? frame % 7 : 6 - (frame % 7)
      return ringDist(index, 0) === reach ? lit(d.color) : OFF
    }
    case 'breathing': {
      const frame = step(timeMs, d.speed)
      const phase = (frame % 60) / 60
      const k = d.minBrightness + (1 - d.minBrightness) * (0.5 - 0.5 * Math.cos(phase * 2 * Math.PI))
      return dim(d.color, k)
    }
    case 'twinkle': {
      const frame = Math.floor(timeMs / 120)
      return hash(index, frame) < d.probability ? lit(d.color) : OFF
    }
    case 'rainbow': {
      const w = Math.max(1, d.width)
      return lit(hsv(((index / w) + timeMs / 4000) % 1, 1, 1))
    }
    case 'mute': {
      if (d.muted && (index === 3 || index === 9)) return lit(RED)
      if (d.silent && (index === 6 || index === 7)) return lit(RED)
      return lit(d.color)
    }
    case 'volume': {
      if (d.level === 0 && index === 6) return lit(RED)
      const lit_ = Math.round(d.level * LED_COUNT)
      return index < lit_ ? lit(d.color) : OFF
    }
    default:
      return OFF
  }
}
