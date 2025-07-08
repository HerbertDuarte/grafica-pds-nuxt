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
          <AlertDialogTitle
            >Tem certeza que deseja deletar esta ficha de
            produção?</AlertDialogTitle
          >
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente esta
            ficha de produção do sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction @click="deleteFichaProducao"
            >Excluir</AlertDialogAction
          >
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
const emit = defineEmits(["fichaProducaoDeletada"]);

const deleteFichaProducao = async () => {
  try {
    await $fetch(`/api/ficha-producao/delete/${id.value}`, {
      method: "DELETE",
    });

    toast({
      title: "Ficha de produção excluída!",
      description: "A ficha de produção foi excluída com sucesso.",
    });

    emit("fichaProducaoDeletada");
  } catch (error) {
    toast({
      title: "Erro ao excluir ficha de produção",
      description: (error as Error).message || "Tente novamente.",
      variant: "destructive",
    });
    console.error("Erro ao excluir ficha de produção:", error);
  }
};
</script>
