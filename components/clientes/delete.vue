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
              >Tem certeza que deseja deletar esse cliente?</AlertDialogTitle
            >
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente este
              cliente do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction @click="deleteCliente">Excluir</AlertDialogAction>
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
  const emit = defineEmits(["clienteDeletado"]);
  
  const deleteCliente = async () => {
    try {
      await $fetch(`/api/clientes/delete/${id.value}`, {
        method: "DELETE",
      });
  
      toast({
        title: "Cliente excluído!",
        description: "O cliente foi excluído com sucesso.",
      });
  
      emit("clienteDeletado");
    } catch (error) {
      toast({
        title: "Erro ao excluir cliente",
        description: (error as any).message || "Tente novamente.",
        variant: "destructive",
      });
      console.error("Erro ao excluir cliente:", error);
    }
  };
  </script>