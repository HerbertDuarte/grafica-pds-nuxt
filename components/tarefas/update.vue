<script setup lang="ts">
import type { Tarefa } from "@prisma/client";
import { Button } from "../ui/button";
import { useToast } from "../ui/toast";

const props = defineProps<{ tarefa: Tarefa }>();

const open = ref(false);
const id = ref(props.tarefa.id);
const nome = ref(props.tarefa.nome);
const obrigatoriedade = ref(props.tarefa.isObrigatorio);
const simultaniedade = ref(props.tarefa.isSimultanea);
const descricao = ref(props.tarefa.descricao); // Use 'descriao' if that's the correct property, otherwise 'descricao'
const error = ref<string>();
const { toast } = useToast();
const emit = defineEmits(["tarefaAtualizada"]);

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

const updateTarefa = async () => {
  if (!validaNome() || !validaDescricao()) {
    toast({
      title: "Erro no formulário",
      description: error.value,
      variant: "destructive",
    });
    return;
  }
  try {
    await $fetch("/api/tarefa/update", {
      method: "put",
      body: {
        id: id.value,
        nome: nome.value,
        isObrigatorio: false,
        isSimultanea: false,
        descricao: descricao.value, // Use 'descriao' if that's the correct property, otherwise 'descricao'
      },
    });
    toast({
      title: "Tarefa editada!",
      description: "A tarefa foi editada com sucesso.",
    });
    emit("tarefaAtualizada");
    open.value = false;
  } catch (error) {
    toast({
      title: "Erro ao editar tarefa",
      description: error instanceof Error ? error.message : "Erro inesperado.",
      variant: "destructive",
    });
    console.error("Erro ao editar tarefa:", error);
  }
};
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button variant="outline">Editar</Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Editar Tarefa</DialogTitle>
        <DialogDescription>
          Edite os campos abaixo para atualizar a tarefa.
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
        <Button type="submit" @click="updateTarefa">Editar Tarefa</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
