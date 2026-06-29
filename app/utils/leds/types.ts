export const LED_COUNT = 12

export interface RGB {
  r: number
  g: number
  b: number
}

// What the engine renders per LED: a color plus an alpha (0 = off/transparent,
// 1 = full glow). On the white device a dim LED reads as a faint glow, not a
// dark dot, so brightness is modelled as alpha rather than darkening the color.
export interface RGBA extends RGB {
  a: number
}

export interface RotateEffect {
  type: 'rotate'
  color: RGB
  speed: number
  direction: 'cw' | 'ccw'
  tail: number
  brightness: number
}

export interface PulseEffect {
  type: 'pulse'
  color: RGB
  speed: number
  mode: 'single' | 'dual' | 'full'
  minBrightness: number
}

export interface WaveEffect {
  type: 'wave'
  color: RGB
  speed: number
  direction: 'out' | 'in'
}

export interface BreathingEffect {
  type: 'breathing'
  color: RGB
  speed: number
  minBrightness: number
}

export interface SolidEffect {
  type: 'solid'
  color: RGB
  indicators: Array<{ index: number; color: RGB }>
}

export interface TwinkleEffect {
  type: 'twinkle'
  color: RGB
  probability: number
}

export interface RainbowEffect {
  type: 'rainbow'
  width: number
}

export type EffectDescriptor =
  | RotateEffect
  | PulseEffect
  | WaveEffect
  | BreathingEffect
  | SolidEffect
  | TwinkleEffect
  | RainbowEffect

export interface MuteEffect {
  type: 'mute'
  color: RGB
  muted: boolean
  silent: boolean
}

export interface VolumeEffect {
  type: 'volume'
  color: RGB
  level: number
}

export type PreviewDescriptor = EffectDescriptor | MuteEffect | VolumeEffect

export const PRESET_DEFAULTS: Record<EffectDescriptor['type'], EffectDescriptor> = {
  rotate: { type: 'rotate', color: { r: 24, g: 187, b: 242 }, speed: 1, direction: 'cw', tail: 3, brightness: 1 },
  pulse: { type: 'pulse', color: { r: 24, g: 187, b: 242 }, speed: 1, mode: 'dual', minBrightness: 0 },
  wave: { type: 'wave', color: { r: 24, g: 187, b: 242 }, speed: 1, direction: 'out' },
  breathing: { type: 'breathing', color: { r: 24, g: 187, b: 242 }, speed: 1, minBrightness: 0 },
  solid: { type: 'solid', color: { r: 24, g: 187, b: 242 }, indicators: [] },
  twinkle: { type: 'twinkle', color: { r: 24, g: 187, b: 242 }, probability: 0.5 },
  rainbow: { type: 'rainbow', width: 12 },
}
