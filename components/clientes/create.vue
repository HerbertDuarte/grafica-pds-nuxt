<template>
    <Dialog v-model:open="open">
      <DialogTrigger as-child>
        <Button> Cadastrar cliente </Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cadastrar Cliente</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para cadastrar um novo cliente.
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
          <Button type="submit" @click="createCliente"> Criar Cliente </Button>
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
  
  const nome = ref("");
  const cpf = ref("");
  const telefone = ref("");
  const email = ref("");
  const open = ref(false);
  const { toast } = useToast();
  const emit = defineEmits(["clienteCriado"]);
  
  const createCliente = async () => {
    try {
      await useFetch("/api/clientes/create", {
        method: "POST",
        body: {
          nome: nome.value,
          cpf: cpf.value,
          telefone: telefone.value,
          email: email.value,
        },
      });
  
      toast({
        title: "Cliente cadastrado!",
        description: "O cliente foi criado com sucesso.",
      });
  
      emit("clienteCriado");
  
      nome.value = "";
      cpf.value = "";
      telefone.value = "";
      email.value = "";
  
      open.value = false;
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Erro ao criar cliente",
          description: error.message || "Tente novamente.",
          variant: "destructive",
        });
        console.error("Erro ao criar cliente:", error);
      }
    }
  };
  </script>