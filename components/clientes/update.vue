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
const erros = ref<{ [key: string]: string }>({});
const { toast } = useToast(); 
const emit = defineEmits(["clienteAtualizado"]);

const formatarCPF = (e: Event) => {
  let value = (e.target as HTMLInputElement).value.replace(/\D/g, "");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  cpf.value = value;
};

const formatarTelefone = (e: Event) => {
  let value = (e.target as HTMLInputElement).value.replace(/\D/g, "");
  value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
  value = value.replace(/(\d{5})(\d)/, "$1-$2");
  telefone.value = value;
};

const validarCampo = (campo: string) => {
  switch (campo) {
    case "nome":
      erros.value.nome = nome.value.trim() ? "" : "Nome é obrigatório";
      break;
    case "cpf":
      erros.value.cpf = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf.value)
        ? ""
        : "CPF inválido (use 000.000.000-00)";
      break;
    case "telefone":
      erros.value.telefone = /^\(\d{2}\) \d{5}-\d{4}$/.test(telefone.value)
        ? ""
        : "Telefone inválido (use (00) 00000-0000)";
      break;
    case "email":
      erros.value.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
        ? ""
        : "Email inválido";
      break;
  }
};

const validarTodos = () => {
  validarCampo("nome");
  validarCampo("cpf");
  validarCampo("telefone");
  validarCampo("email");

  return Object.values(erros.value).every((erro) => erro === "");
};

const updateCliente = async () => {
  if (!validarTodos()) {
    toast({
      title: "Erro no formulário",
      description: "Preencha todos os campos corretamente.",
      variant: "destructive",
    });
    return;
  }

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
          <div class="col-span-3">
            <Input
              id="nome"
              v-model="nome"
              placeholder="Digite o nome do cliente"
              @blur="validarCampo('nome')"
            />
            <p v-if="erros.nome" class="text-red-500 text-sm mt-1">{{ erros.nome }}</p>
          </div>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="cpf" class="text-right"> CPF </Label>
          <div class="col-span-3">
            <Input
              id="cpf"
              v-model="cpf"
              placeholder="Ex: 000.000.000-00"
              @input="formatarCPF"
              @blur="validarCampo('cpf')"
            />
            <p v-if="erros.cpf" class="text-red-500 text-sm mt-1">{{ erros.cpf }}</p>
          </div>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="telefone" class="text-right"> Telefone </Label>
          <div class="col-span-3">
            <Input
              id="telefone"
              v-model="telefone"
              placeholder="(00) 00000-0000"
              @input="formatarTelefone"
              @blur="validarCampo('telefone')"
            />
            <p v-if="erros.telefone" class="text-red-500 text-sm mt-1">{{ erros.telefone }}</p>
          </div>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="email" class="text-right"> Email </Label>
          <div class="col-span-3">
            <Input
              id="email"
              v-model="email"
              placeholder="exemplo@email.com"
              @blur="validarCampo('email')"
            />
            <p v-if="erros.email" class="text-red-500 text-sm mt-1">{{ erros.email }}</p>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" @click="updateCliente"> Editar Cliente </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>