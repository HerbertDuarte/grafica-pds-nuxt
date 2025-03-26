<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>
<template>
  <div class="p-6">
    <p class="text-xl font-semibold">{{ title }}</p>
    <slot />
  </div>
</template>
