<script setup lang="ts">
const show = ref(false);

function handleShow() {
  show.value = !show.value;
}

const tabs = [
  { title: "Tela inicial", path: "/" },
  { title: "Módulo de pedidos", path: "/pedidos" },
  { title: "Módulo de funcionários", path: "/funcionarios" },
  { title: "Módulo de clientes", path: "/clientes" },
  { title: "Módulo de produtos", path: "/produtos" },
  { title: "Módulo de produção", path: "/producao" },
];
</script>
<template>
  <div>
    <div class="p-4 border-r bg-white min-h-screen fixed">
      <Button class="p-3 mb-3" variant="secondary" @click="handleShow">
        <LucideMenu />
      </Button>

      <div v-if="show" class="max-w-[300px] flex flex-col items-stretch">
        <RouterLink v-for="tab in tabs" :key="tab.path" :to="tab.path">
          <Button
            class="!justify-start w-full"
            variant="ghost"
            @click="handleShow"
          >
            {{ tab.title }}
          </Button>
        </RouterLink>
      </div>
    </div>
    <div class="pl-20">
      <slot />
    </div>
  </div>
</template>
