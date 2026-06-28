<script setup lang="ts">
const props = defineProps<{ open: boolean; code: string }>()
const emit = defineEmits<{ 'update:open': [boolean] }>()
const toast = useToast()

async function copy() {
  await navigator.clipboard.writeText(props.code)
  toast.add({ title: 'Copied', color: 'success' })
}
</script>

<template>
  <UModal :open="open" title="Effect YAML" @update:open="emit('update:open', $event)">
    <template #body>
      <p class="text-sm text-[var(--ui-text-muted)] mb-2">
        Paste this block into the <code>effects:</code> list under your
        <code>light:</code> with <code>id: voice_assistant_leds</code>, then wire
        it up with a script yourself.
        Note: preview-only parameters (speed, brightness, min brightness, twinkle probability) are not encoded here — tune <code>update_interval</code> and brightness directly in ESPHome.
      </p>
      <pre class="text-xs overflow-x-auto p-3 rounded bg-[var(--ui-bg-muted)]">{{ code }}</pre>
      <UButton class="mt-3" icon="i-lucide-copy" @click="copy">Copy</UButton>
    </template>
  </UModal>
</template>
