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
          <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente este produto do sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction @click="deleteProduct" >Excluir</AlertDialogAction>
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
const emit = defineEmits(["produtoDeletado"]);

const deleteProduct = async () => {
  try {
    const response = await $fetch(`/api/produto/delete/${id.value}`, {
      method: "DELETE",
    });

    
    toast({
      title: "Produto excluido!",
      description: "O produto foi excluido com sucesso.",
    });

    emit("produtoDeletado");
    
    
  } catch (error) {
    toast({
      title: "Erro ao excluir produto",
      description: (error as any).message || "Tente novamente.",
      variant: "destructive",
    });
    console.error("Erro ao excluir produto:", error);
  }
};


</script>

<style></style>
