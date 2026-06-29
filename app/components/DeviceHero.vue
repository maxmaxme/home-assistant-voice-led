<script setup lang="ts">
import type { PreviewDescriptor } from '~/utils/leds/types'
import topUrl from '~/assets/top.png'

// orbit/dot are tuned so the LEDs sit on the device's light-guide ring in top.png.
// Nudge these two numbers if the dots don't line up with the groove.
withDefaults(
  defineProps<{ descriptor: PreviewDescriptor; size?: number; orbit?: number; dot?: number }>(),
  { size: 360, orbit: 0.52, dot: 0.05 },
)
</script>

<template>
  <div class="relative" :style="{ width: size + 'px', height: size + 'px' }">
    <img :src="topUrl" alt="Home Assistant Voice PE" class="absolute inset-0 w-full h-full object-contain" />
    <LedRing
      :descriptor="descriptor"
      :size="size"
      :background="false"
      :orbit="orbit"
      :dot="dot"
      class="absolute inset-0"
    />
  </div>
</template>
