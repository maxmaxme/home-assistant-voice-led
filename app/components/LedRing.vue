<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { LED_COUNT } from '~/utils/leds/types'
import type { PreviewDescriptor, RGB } from '~/utils/leds/types'
import { ledColor } from '~/utils/leds/engine'

const props = withDefaults(
  defineProps<{
    descriptor: PreviewDescriptor
    size?: number
    background?: boolean
    // LED orbit radius as a fraction of (size / 2); tune for the device overlay.
    orbit?: number
    // LED dot radius as a fraction of size.
    dot?: number
  }>(),
  { size: 140, background: true, orbit: 0.77, dot: 0.045 },
)

const colors = ref<RGB[]>(Array.from({ length: LED_COUNT }, () => ({ r: 0, g: 0, b: 0 })))
let raf = 0
let start = 0

function frame(now: number) {
  if (!start) start = now
  const t = now - start
  colors.value = Array.from({ length: LED_COUNT }, (_, i) => ledColor(i, t, props.descriptor))
  raf = requestAnimationFrame(frame)
}

onMounted(() => { raf = requestAnimationFrame(frame) })
onBeforeUnmount(() => cancelAnimationFrame(raf))

const orbitR = computed(() => (props.size / 2) * props.orbit)
const dotR = computed(() => props.size * props.dot)

function pos(i: number, r: number, c: number) {
  const a = (i / LED_COUNT) * Math.PI * 2 - Math.PI / 2
  return { x: c + r * Math.cos(a), y: c + r * Math.sin(a) }
}
const rgb = (c: RGB) => `rgb(${c.r},${c.g},${c.b})`
</script>

<template>
  <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
    <circle v-if="background" :cx="size / 2" :cy="size / 2" :r="size / 2 - 4" fill="#111" />
    <circle
      v-for="(c, i) in colors"
      :key="i"
      :cx="pos(i, orbitR, size / 2).x"
      :cy="pos(i, orbitR, size / 2).y"
      :r="dotR"
      :fill="rgb(c)"
      :stroke="rgb(c)"
      stroke-width="1"
    />
  </svg>
</template>
