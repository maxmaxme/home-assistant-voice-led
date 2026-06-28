<script setup lang="ts">
import type { CatalogEntry } from '~/utils/leds/catalog'
defineProps<{ entry: CatalogEntry }>()
</script>

<template>
  <UCard>
    <div class="flex items-center gap-4">
      <LedRing :descriptor="entry.descriptor" :size="96" />
      <div>
        <div class="flex items-center gap-2">
          <h3 class="font-semibold">{{ entry.title }}</h3>
          <UBadge color="neutral" variant="subtle">{{ entry.phase }}</UBadge>
        </div>
        <p class="text-sm text-[var(--ui-text-muted)] mt-1">{{ entry.description }}</p>
      </div>
    </div>
  </UCard>
</template>
