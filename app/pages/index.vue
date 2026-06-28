<script setup lang="ts">
import { CATALOG } from '~/utils/leds/catalog'

const tabs = [
  { label: 'Reference', slot: 'reference' as const },
  { label: 'Builder', slot: 'builder' as const },
]
</script>

<template>
  <UContainer class="py-8">
    <h1 class="text-3xl font-bold mb-6">Voice PE LED</h1>
    <UTabs :items="tabs">
      <template #reference>
        <div class="grid sm:grid-cols-2 gap-4 mt-4">
          <EffectCard v-for="e in CATALOG" :key="e.id" :entry="e" />
        </div>
      </template>
      <template #builder>
        <EffectBuilder class="mt-4" />
      </template>
    </UTabs>
  </UContainer>
</template>
