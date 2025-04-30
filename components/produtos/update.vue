<script lang="ts" setup>
import type { Produto } from "@prisma/client";
import { Pen } from "lucide-vue-next";
import { Button } from "../ui/button";
import { useToast } from "../ui/toast";


const props = defineProps<{
  produto: Produto
}>();

const open = ref(false);
const id = ref(props.produto.id);
const name = ref(props.produto.nome);
const price = ref(props.produto.preco);
const desc = ref(props.produto.descricao);
const { toast } = useToast(); 
const emit = defineEmits(["produtoAtualizado"]);

const updateProduct = async () => {
  try {
    const response = await $fetch("/api/produto/put-update", {
      method: "put",
      body: {
        id: id.value,
        nome: name.value,
        preco: price.value,
        descricao: desc.value,
      },
    });

    
    toast({
      title: "Produto editado!",
      description: "O produto foi editado com sucesso.",
    });

    emit("produtoAtualizado");
    
    open.value = false;
  } catch (error) {
    toast({
      title: "Erro ao editar produto",
      description: (error as any).message || "Tente novamente.",
      variant: "destructive",
    });
    console.error("Erro ao editar produto:", error);
  }
};


</script>



<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button variant="outline" class="transition-transform duration-200 hover:-translate-y-1"> <Pen /> </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Editar Produto</DialogTitle>
        <DialogDescription>
          Edite os campos abaixo para editar o produto.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right"> Nome </Label>
          <Input
            id="name"
            v-model="name"
            class="col-span-3"
            placeholder="Digite o nome do produto"
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="price" class="text-right"> Preço R$ </Label>
          <Input
            id="price"
            v-model="price"
            class="col-span-3"
            placeholder="Ex: 199.90"
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="desc" class="text-right"> Descrição </Label>
          <Input
            id="desc"
            v-model="desc"
            class="col-span-3"
            placeholder="Descreva o produto"
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" @click="updateProduct"> Editar Produto </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>



<style scoped></style>
