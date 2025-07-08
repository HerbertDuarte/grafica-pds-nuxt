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
            >Tem certeza que deseja deletar esse pedido?</AlertDialogTitle
          >
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente este
            pedido do sistema. Certifique-se de que não há fichas de produção ou
            produtos associados a este pedido.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction @click="deletePedido">Excluir</AlertDialogAction>
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
const emit = defineEmits(["pedidoDeletado"]);

const deletePedido = async () => {
  try {
    await $fetch(`/api/pedidos/delete/${id.value}`, {
      method: "DELETE",
    });

    toast({
      title: "Pedido excluído!",
      description: "O pedido foi excluído com sucesso.",
    });

    emit("pedidoDeletado");
  } catch (error) {
    toast({
      title: "Erro ao excluir pedido",
      description: error instanceof Error ? error.message : "Tente novamente.",
      variant: "destructive",
    });
    console.error("Erro ao excluir pedido:", error);
  }
};
</script>
