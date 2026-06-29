<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { LED_COUNT } from '~/utils/leds/types'
import type { PreviewDescriptor, RGBA } from '~/utils/leds/types'
import { ledColor } from '~/utils/leds/engine'

// The SVG always draws in a fixed 100×100 coordinate space; `size` only sets the
// rendered width/height. A static viewBox avoids Vue's SSR-hydration attempt to
// set the read-only `viewBox` DOM property.
const VB = 100

const props = withDefaults(
  defineProps<{
    descriptor: PreviewDescriptor
    size?: number
    background?: boolean
    // LED orbit radius as a fraction of the half-canvas; tune for the device overlay.
    orbit?: number
    // LED dot radius as a fraction of the canvas.
    dot?: number
  }>(),
  { size: 140, background: true, orbit: 0.77, dot: 0.045 },
)

const colors = ref<RGBA[]>(Array.from({ length: LED_COUNT }, () => ({ r: 0, g: 0, b: 0, a: 0 })))
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

const orbitR = computed(() => (VB / 2) * props.orbit)
const dotR = computed(() => VB * props.dot)

function pos(i: number, r: number) {
  const a = (i / LED_COUNT) * Math.PI * 2 - Math.PI / 2
  return { x: VB / 2 + r * Math.cos(a), y: VB / 2 + r * Math.sin(a) }
}
const rgb = (c: RGBA) => `rgb(${c.r},${c.g},${c.b})`
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 100 100">
    <circle v-if="background" :cx="VB / 2" :cy="VB / 2" :r="VB / 2 - 2" fill="#111" />
    <circle
      v-for="(c, i) in colors"
      :key="i"
      :cx="pos(i, orbitR).x"
      :cy="pos(i, orbitR).y"
      :r="dotR"
      :fill="rgb(c)"
      :fill-opacity="c.a"
      :stroke="rgb(c)"
      :stroke-opacity="c.a"
      stroke-width="0.7"
    />
  </svg>
</template>
