<script lang="ts" setup>
import type { Cliente } from "@prisma/client";
import { Pen } from "lucide-vue-next";
import { Button } from "../ui/button";
import { useToast } from "../ui/toast";

const props = defineProps<{
  cliente: Cliente
}>();

const open = ref(false);
const id = ref(props.cliente.id);
const nome = ref(props.cliente.nome);
const cpf = ref(props.cliente.cpf);
const telefone = ref(props.cliente.telefone);
const email = ref(props.cliente.email);
const { toast } = useToast(); 
const emit = defineEmits(["clienteAtualizado"]);

const updateCliente = async () => {
  try {
    await $fetch("/api/clientes/update", {
      method: "put",
      body: {
        id: id.value,
        nome: nome.value,
        cpf: cpf.value,
        telefone: telefone.value,
        email: email.value,
      },
    });
    
    toast({
      title: "Cliente editado!",
      description: "O cliente foi editado com sucesso.",
    });

    emit("clienteAtualizado");
    
    open.value = false;
  } catch (error) {
    toast({
      title: "Erro ao editar cliente",
      description: (error as any).message || "Tente novamente.",
      variant: "destructive",
    });
    console.error("Erro ao editar cliente:", error);
  }
};
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button variant="outline" class="transition-transform duration-200 hover:-translate-y-1"> 
        <Pen /> 
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Editar Cliente</DialogTitle>
        <DialogDescription>
          Edite os campos abaixo para atualizar o cliente.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="nome" class="text-right"> Nome </Label>
          <Input
            id="nome"
            v-model="nome"
            class="col-span-3"
            placeholder="Digite o nome do cliente"
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="cpf" class="text-right"> CPF </Label>
          <Input
            id="cpf"
            v-model="cpf"
            class="col-span-3"
            placeholder="Ex: 000.000.000-00"
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="telefone" class="text-right"> Telefone </Label>
          <Input
            id="telefone"
            v-model="telefone"
            class="col-span-3"
            placeholder="(00) 00000-0000"
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="email" class="text-right"> Email </Label>
          <Input
            id="email"
            v-model="email"
            class="col-span-3"
            placeholder="exemplo@email.com"
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" @click="updateCliente"> Editar Cliente </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>