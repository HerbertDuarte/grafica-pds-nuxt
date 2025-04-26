<script setup lang="ts">
import { Input } from "../ui/input";
import { useVModel } from "@vueuse/core";
import { Search } from "lucide-vue-next";

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
}>();

const emits = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "search"): void;
}>();

const searchTerm = useVModel(props, "modelValue", emits);

const handleKeyup = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    emits("search");
  }
};
</script>

<template>
  <div class="relative w-full max-w-sm items-center">
    <Input
      v-model="searchTerm"
      :placeholder="placeholder || 'Pesquisar...'"
      class="pl-10"
      @keyup="handleKeyup"
    />
    <span
      class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
    >
      <Search class="size-5 text-muted-foreground" />
    </span>
  </div>
</template>
