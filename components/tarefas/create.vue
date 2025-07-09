<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button>Cadastrar tarefa</Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Cadastrar Tarefa</DialogTitle>
        <DialogDescription>
          Preencha os campos abaixo para cadastrar uma nova tarefa.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="nome" class="text-right">Nome</Label>
          <Input
            id="nome"
            v-model="nome"
            class="col-span-3"
            placeholder="Nome da tarefa"
          />
        </div>
        <!-- <div class="grid grid-cols-4 items-center gap-4">
          <Label for="obrigatoriedade" class="text-right">Obrigatória?</Label>
          <input
            id="obrigatoriedade"
            type="checkbox"
            v-model="obrigatoriedade"
            class="col-span-3"
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="simultaniedade" class="text-right">Simultânea?</Label>
          <input
            id="simultaniedade"
            type="checkbox"
            v-model="simultaniedade"
            class="col-span-3"
          />
        </div> -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="descricao" class="text-right">Descrição</Label>
          <Input
            id="descricao"
            v-model="descricao"
            class="col-span-3"
            placeholder="Descrição"
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" @click="createTarefa">Criar Tarefa</Button>
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
import { Button } from "@/components/ui/button";

const nome = ref("");
const obrigatoriedade = ref(false);
const simultaniedade = ref(false);
const descricao = ref("");
const open = ref(false);
const error = ref<string>();
const { toast } = useToast();
const emit = defineEmits(["tarefaCriada"]);

function validaNome() {
  if (nome.value.trim().length < 3) {
    error.value =
      "Nome muito curto. O nome precisa ter no mínimo 3 caracteres.";
    return false;
  }
  return true;
}
function validaDescricao() {
  if (descricao.value.trim().length < 5) {
    error.value =
      "Descrição muito curta. A descrição precisa ter no mínimo 5 caracteres.";
    return false;
  }
  return true;
}

const createTarefa = async () => {
  if (!validaNome() || !validaDescricao()) {
    toast({
      title: "Erro no formulário",
      description: error.value,
      variant: "destructive",
    });
    return;
  }
  try {
    await useFetch("/api/tarefa/create", {
      method: "POST",
      body: {
        nome: nome.value,
        obrigatoriedade: false,
        simultaniedade: false,
        descricao: descricao.value,
      },
    });
    toast({
      title: "Tarefa cadastrada!",
      description: "A tarefa foi criada com sucesso.",
    });
    emit("tarefaCriada");
    nome.value = "";
    obrigatoriedade.value = false;
    simultaniedade.value = false;
    descricao.value = "";
    error.value = undefined;
    open.value = false;
  } catch (error) {
    toast({
      title: "Erro ao criar tarefa",
      description: error instanceof Error ? error.message : "Erro inesperado.",
      variant: "destructive",
    });
    console.error("Erro ao criar tarefa:", error);
  }
};
</script>
