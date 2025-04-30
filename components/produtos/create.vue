<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button> Cadastrar produto </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Cadastrar Produto</DialogTitle>
        <DialogDescription>
          Preencha os campos abaixo para cadastrar um novo produto.
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
        <Button type="submit" @click="createProduct"> Criar Produto </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "@/components/ui/toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const name = ref("");
const price = ref("");
const desc = ref("");
const open = ref(false);
const { toast } = useToast();
const emit = defineEmits(["produtoCriado"]);

const createProduct = async () => {
  try {
    await useFetch("/api/produto/post-create", {
      method: "POST",
      body: {
        nome: name.value,
        preco: price.value,
        descricao: desc.value,
      },
    });

    // WIP: Verificar se o produto foi criado com sucesso
    toast({
      title: "Produto cadastrado!",
      description: "O produto foi criado com sucesso.",
    });

    emit("produtoCriado");

    name.value = "";
    price.value = "";
    desc.value = "";

    open.value = false;
  } catch (error) {
    if (error instanceof Error) {
      toast({
        title: "Erro ao criar produto",
        description: error.message || "Tente novamente.",
        variant: "destructive",
      });
      console.error("Erro ao criar produto:", error);
    }
  }
};
</script>

<style scoped></style>
