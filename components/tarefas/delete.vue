<template>
  <AlertDialog>
    <AlertDialogTrigger as-child>
      <Button variant="destructive">Excluir</Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Tem certeza que deseja deletar esta tarefa?</AlertDialogTitle>
        <AlertDialogDescription>
          Esta ação não pode ser desfeita. Isso excluirá permanentemente esta tarefa do sistema.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction @click="deleteTarefa">Excluir</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script setup lang="ts">
import { Button } from "../ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "../ui/toast";

const props = defineProps<{ id: number }>();
const { toast } = useToast();
const emit = defineEmits(["tarefaDeletada"]);

const deleteTarefa = async () => {
  try {
    await $fetch(`/api/tarefa/delete/${props.id}`, { method: "DELETE" });
    toast({
      title: "Tarefa excluída!",
      description: "A tarefa foi excluída com sucesso.",
    });
    emit("tarefaDeletada");
  } catch (error) {
    toast({
      title: "Erro ao excluir tarefa",
      description: error instanceof Error ? error.message : "Erro inesperado.",
      variant: "destructive",
    });
    console.error("Erro ao excluir tarefa:", error);
  }
};
</script>