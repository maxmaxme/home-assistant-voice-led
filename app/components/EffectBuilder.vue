<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { PRESET_DEFAULTS } from '~/utils/leds/types'
import type { EffectDescriptor, RGB } from '~/utils/leds/types'
import { toYaml } from '~/utils/leds/toYaml'

const presetItems = [
  { label: 'Rotate', value: 'rotate' },
  { label: 'Pulse', value: 'pulse' },
  { label: 'Wave', value: 'wave' },
  { label: 'Breathing', value: 'breathing' },
  { label: 'Solid', value: 'solid' },
  { label: 'Twinkle', value: 'twinkle' },
  { label: 'Rainbow', value: 'rainbow' },
] as const

const name = ref('My Effect')
const type = ref<EffectDescriptor['type']>('rotate')
const state = reactive<Record<string, EffectDescriptor>>(
  Object.fromEntries(Object.entries(PRESET_DEFAULTS).map(([k, v]) => [k, structuredClone(v)])),
)
const descriptor = computed<EffectDescriptor>(() => state[type.value])
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const d = computed<any>(() => descriptor.value)

const hex = computed({
  get: () => rgbToHex((descriptor.value as { color?: RGB }).color ?? { r: 0, g: 0, b: 0 }),
  set: (h: string) => {
    const c = descriptor.value as { color?: RGB }
    if (c.color) c.color = hexToRgb(h)
  },
})
function rgbToHex(c: RGB) { return '#' + [c.r, c.g, c.b].map(x => x.toString(16).padStart(2, '0')).join('') }
function hexToRgb(h: string): RGB { return { r: parseInt(h.slice(1, 3), 16), g: parseInt(h.slice(3, 5), 16), b: parseInt(h.slice(5, 7), 16) } }
const pct = (x: number) => Math.round(x * 100) + '%'

const directionItems = computed(() =>
  type.value === 'wave'
    ? [{ label: 'Outward', value: 'out' }, { label: 'Inward', value: 'in' }]
    : [{ label: 'Clockwise', value: 'cw' }, { label: 'Counter-clockwise', value: 'ccw' }],
)
const modeItems = [
  { label: 'Single spot', value: 'single' },
  { label: 'Two spots', value: 'dual' },
  { label: 'Whole ring', value: 'full' },
]

const exportOpen = ref(false)
const code = computed(() => toYaml(descriptor.value, name.value))
</script>

<template>
  <div class="grid lg:grid-cols-2 gap-8 items-start">
    <UCard>
      <div class="space-y-6">
        <div class="grid sm:grid-cols-2 gap-4">
          <UFormField label="Effect name">
            <UInput v-model="name" class="w-full" />
          </UFormField>
          <UFormField label="Preset">
            <USelect v-model="type" :items="presetItems" class="w-full" />
          </UFormField>
        </div>

        <USeparator label="Parameters" />

        <div class="space-y-5">
          <UFormField v-if="'color' in d" label="Color">
            <div class="flex items-center gap-3">
              <input
                type="color"
                v-model="hex"
                class="h-10 w-16 cursor-pointer rounded-lg border border-[var(--ui-border)] bg-transparent p-0"
              />
              <span class="font-mono text-sm text-[var(--ui-text-muted)]">{{ hex }}</span>
            </div>
          </UFormField>

          <UFormField v-if="'speed' in d" label="Speed" :hint="String(d.speed)">
            <USlider v-model="d.speed" :min="1" :max="6" :step="1" />
          </UFormField>

          <UFormField v-if="'direction' in d" label="Direction">
            <USelect v-model="d.direction" :items="directionItems" class="w-full" />
          </UFormField>

          <UFormField v-if="'mode' in d" label="Mode">
            <USelect v-model="d.mode" :items="modeItems" class="w-full" />
          </UFormField>

          <UFormField v-if="'tail' in d" label="Tail length" :hint="String(d.tail)">
            <USlider v-model="d.tail" :min="0" :max="11" :step="1" />
          </UFormField>

          <UFormField v-if="'brightness' in d" label="Brightness" :hint="pct(d.brightness)">
            <USlider v-model="d.brightness" :min="0" :max="1" :step="0.05" />
          </UFormField>

          <UFormField v-if="'minBrightness' in d" label="Min brightness" :hint="pct(d.minBrightness)">
            <USlider v-model="d.minBrightness" :min="0" :max="1" :step="0.05" />
          </UFormField>

          <UFormField v-if="'probability' in d" label="Twinkle probability" :hint="pct(d.probability)">
            <USlider v-model="d.probability" :min="0" :max="1" :step="0.05" />
          </UFormField>

          <UFormField v-if="'width' in d" label="Width" :hint="String(d.width)">
            <USlider v-model="d.width" :min="1" :max="12" :step="1" />
          </UFormField>

          <UFormField v-if="'indicators' in d" label="Indicator LEDs">
            <div class="space-y-2">
              <div
                v-for="(ind, idx) in d.indicators"
                :key="idx"
                class="flex items-center gap-2 rounded-lg border border-[var(--ui-border)] p-2"
              >
                <UInput v-model.number="ind.index" type="number" :min="0" :max="11" class="w-20" />
                <input
                  type="color"
                  :value="rgbToHex(ind.color)"
                  class="h-9 w-12 cursor-pointer rounded-lg border border-[var(--ui-border)] bg-transparent p-0"
                  @input="ind.color = hexToRgb(($event.target as HTMLInputElement).value)"
                />
                <div class="grow" />
                <UButton color="error" variant="ghost" icon="i-lucide-trash-2" @click="d.indicators.splice(idx, 1)" />
              </div>
              <UButton
                variant="soft"
                icon="i-lucide-plus"
                @click="d.indicators.push({ index: 0, color: { r: 255, g: 0, b: 0 } })"
              >Add indicator</UButton>
            </div>
          </UFormField>
        </div>

        <USeparator />

        <UButton block size="lg" color="primary" icon="i-lucide-code" @click="exportOpen = true">
          Export YAML
        </UButton>
      </div>
    </UCard>

    <div class="flex justify-center lg:sticky lg:top-6">
      <DeviceHero :descriptor="descriptor" :size="360" />
    </div>

    <ExportModal v-model:open="exportOpen" :code="code" />
  </div>
</template>
