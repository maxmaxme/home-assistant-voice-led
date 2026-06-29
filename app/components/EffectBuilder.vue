<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { PRESET_DEFAULTS } from '~/utils/leds/types'
import type { EffectDescriptor, RGB } from '~/utils/leds/types'
import { toYaml } from '~/utils/leds/toYaml'

const presetItems = [
  { label: 'Rotate', value: 'rotate' },
  { label: 'Pulse', value: 'pulse' },
  { label: 'Wave', value: 'wave' },
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

const hex = computed({
  get: () => rgbToHex((descriptor.value as { color?: RGB }).color ?? { r: 0, g: 0, b: 0 }),
  set: (h: string) => {
    const d = descriptor.value as { color?: RGB }
    if (d.color) d.color = hexToRgb(h)
  },
})
function rgbToHex(c: RGB) { return '#' + [c.r, c.g, c.b].map(x => x.toString(16).padStart(2, '0')).join('') }
function hexToRgb(h: string): RGB { return { r: parseInt(h.slice(1, 3), 16), g: parseInt(h.slice(3, 5), 16), b: parseInt(h.slice(5, 7), 16) } }

const exportOpen = ref(false)
const code = computed(() => toYaml(descriptor.value, name.value))
</script>

<template>
  <div class="grid md:grid-cols-2 gap-6">
    <div class="space-y-4">
      <UFormField label="Effect name">
        <UInput v-model="name" />
      </UFormField>
      <UFormField label="Preset">
        <USelect v-model="type" :items="presetItems" />
      </UFormField>
      <UFormField v-if="'color' in descriptor" label="Color">
        <input type="color" v-model="hex" class="h-9 w-16 rounded" />
      </UFormField>
      <UFormField v-if="'speed' in descriptor" label="Speed">
        <UInput v-model.number="(descriptor as any).speed" type="number" min="1" max="6" />
      </UFormField>
      <UFormField v-if="'direction' in descriptor" label="Direction">
        <USelect
          v-model="(descriptor as any).direction"
          :items="type === 'wave'
            ? [{ label: 'Outward', value: 'out' }, { label: 'Inward', value: 'in' }]
            : [{ label: 'Clockwise', value: 'cw' }, { label: 'Counter-clockwise', value: 'ccw' }]"
        />
      </UFormField>
      <UFormField v-if="'tail' in descriptor" label="Tail length">
        <UInput v-model.number="(descriptor as any).tail" type="number" min="0" max="11" />
      </UFormField>
      <UFormField v-if="'mode' in descriptor" label="Mode">
        <USelect
          v-model="(descriptor as any).mode"
          :items="[{ label: 'Single spot', value: 'single' }, { label: 'Two spots', value: 'dual' }, { label: 'Whole ring', value: 'full' }]"
        />
      </UFormField>
      <UFormField v-if="'brightness' in descriptor" label="Brightness">
        <UInput v-model.number="(descriptor as any).brightness" type="number" min="0" max="1" step="0.1" />
      </UFormField>
      <UFormField v-if="'minBrightness' in descriptor" label="Min brightness">
        <UInput v-model.number="(descriptor as any).minBrightness" type="number" min="0" max="1" step="0.1" />
      </UFormField>
      <UFormField v-if="'probability' in descriptor" label="Twinkle probability">
        <UInput v-model.number="(descriptor as any).probability" type="number" min="0" max="1" step="0.05" />
      </UFormField>
      <UFormField v-if="'width' in descriptor" label="Width">
        <UInput v-model.number="(descriptor as any).width" type="number" min="1" max="12" />
      </UFormField>
      <template v-if="'indicators' in descriptor">
        <UFormField label="Indicators">
          <div class="space-y-2">
            <div
              v-for="(ind, idx) in (descriptor as any).indicators"
              :key="idx"
              class="flex items-center gap-2"
            >
              <UInput v-model.number="ind.index" type="number" min="0" max="11" class="w-20" />
              <input
                type="color"
                :value="rgbToHex(ind.color)"
                @input="ind.color = hexToRgb(($event.target as HTMLInputElement).value)"
                class="h-9 w-10 rounded"
              />
              <UButton
                color="error"
                variant="ghost"
                icon="i-lucide-trash-2"
                @click="(descriptor as any).indicators.splice(idx, 1)"
              />
            </div>
            <UButton
              variant="outline"
              icon="i-lucide-plus"
              @click="(descriptor as any).indicators.push({ index: 0, color: { r: 255, g: 0, b: 0 } })"
            >Add indicator</UButton>
          </div>
        </UFormField>
      </template>
      <UButton icon="i-lucide-code" @click="exportOpen = true">Export</UButton>
    </div>

    <div class="flex items-center justify-center">
      <DeviceHero :descriptor="descriptor" :size="360" />
    </div>

    <ExportModal v-model:open="exportOpen" :code="code" />
  </div>
</template>
