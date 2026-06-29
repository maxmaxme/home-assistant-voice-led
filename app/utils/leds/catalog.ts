import type { PreviewDescriptor } from './types'

export interface CatalogEntry {
  id: string
  title: string
  phase: string
  description: string
  descriptor: PreviewDescriptor
}

const BLUE = { r: 24, g: 187, b: 242 }
const RED = { r: 255, g: 0, b: 0 }
const OFF = { r: 0, g: 0, b: 0 }

export const CATALOG: CatalogEntry[] = [
  { id: 'idle', title: 'Idle', phase: 'idle', description: 'LEDs off, waiting for the wake word (unless you turn the ring light on).', descriptor: { type: 'solid', color: { r: 0, g: 0, b: 0 }, indicators: [] } },
  { id: 'waiting', title: 'Ready for command', phase: 'waiting', description: 'Slow clockwise rotation after the wake word.', descriptor: { type: 'rotate', color: BLUE, speed: 1, direction: 'cw', tail: 4, brightness: 1 } },
  { id: 'listening', title: 'Listening', phase: 'listening', description: 'Fast clockwise rotation while listening to the command.', descriptor: { type: 'rotate', color: BLUE, speed: 2, direction: 'cw', tail: 4, brightness: 1 } },
  { id: 'thinking', title: 'Thinking', phase: 'thinking', description: 'Two opposite LEDs pulse in place while the request is processed.', descriptor: { type: 'pulse', color: BLUE, speed: 3, mode: 'dual', minBrightness: 0 } },
  { id: 'replying', title: 'Replying', phase: 'replying', description: 'Fast counter-clockwise rotation while the reply plays.', descriptor: { type: 'rotate', color: BLUE, speed: 2, direction: 'ccw', tail: 4, brightness: 1 } },
  { id: 'error', title: 'Error', phase: 'error', description: 'Red pulse across the whole ring.', descriptor: { type: 'pulse', color: { r: 255, g: 0, b: 0 }, speed: 3, mode: 'full', minBrightness: 0 } },
  { id: 'mute', title: 'Microphone muted', phase: 'state', description: 'Two red LEDs on a diagonal; the rest of the ring is off.', descriptor: { type: 'solid', color: OFF, indicators: [{ index: 2, color: RED }, { index: 8, color: RED }] } },
  { id: 'volume', title: 'Volume', phase: 'state', description: 'A filled arc shows the current volume level.', descriptor: { type: 'volume', color: BLUE, level: 0.5 } },
]
