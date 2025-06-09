<template>
  <div>
    <AlertDialog>
      <AlertDialogTrigger as-child>
        <Button
          class="transition-transform duration-200 hover:-translate-y-1"
          variant="destructive"
        >
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Tem certeza que deseja deletar esse funcionário?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente este
            funcionário do sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction @click="deleteFuncionario">Excluir</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<script lang="ts" setup>
import { Trash } from "lucide-vue-next";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "../ui/toast";

const props = defineProps<{
  id: number;
}>();

const id = ref(props.id);
const { toast } = useToast();
const emit = defineEmits(["funcionarioDeletado"]);

const deleteFuncionario = async () => {
  try {
    const response = await $fetch(`/api/funcionario/delete/${id.value}`, {
      method: "DELETE",
    });

    toast({
      title: "Funcionário excluído!",
      description: "O funcionário foi excluído com sucesso.",
    });

    emit("funcionarioDeletado");
  } catch (error) {
    toast({
      title: "Erro ao excluir funcionário",
      description: (error as any).message || "Tente novamente.",
      variant: "destructive",
    });
    console.error("Erro ao excluir funcionário:", error);
  }
};
</script>

<style></style>
