<script lang="ts" setup>
import type { Cliente } from "@prisma/client";
import { Pen } from "lucide-vue-next";
import { Button } from "../ui/button";
import { useToast } from "../ui/toast";

const props = defineProps<{
  cliente: Cliente;
}>();

const open = ref(false);
const id = ref(props.cliente.id);
const nome = ref(props.cliente.nome);
const cpf = ref(props.cliente.cpf);
const telefone = ref(props.cliente.telefone);
const email = ref(props.cliente.email);
const endereco = ref(props.cliente.endereco ?? "");
const error = ref<string>();
const { toast } = useToast();
const emit = defineEmits(["clienteAtualizado"]);

const limparNumero = (valor: string) => valor.replace(/\D/g, "");

// Validações individuais
function validaNome() {
  if (nome.value.trim().length < 3) {
    error.value = "Nome muito curto. O nome precisa ter no mínimo 3 caracteres.";
    return false;
  }
  error.value = undefined;
  return true;
}

function validaEndereco() {
  if (endereco.value.trim().length < 5) {
    error.value = "Endereço muito curto. O endereço precisa ter no mínimo 5 caracteres.";
    return false;
  }
  error.value = undefined;
  return true;
}

function validaCPF() {
  const digitsOnly = limparNumero(cpf.value);
  if (
    digitsOnly.length !== 11 ||
    !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf.value)
  ) {
    error.value = "CPF inválido. Use o formato 000.000.000-00 com 11 dígitos.";
    return false;
  }
  error.value = undefined;
  return true;
}

function validaTelefone() {
  const digitsOnly = limparNumero(telefone.value);
  if (
    (digitsOnly.length !== 10 && digitsOnly.length !== 11) ||
    !/^\(\d{2}\) \d{4,5}-\d{4}$/.test(telefone.value)
  ) {
    error.value = "Telefone inválido. Use o formato (00) 00000-0000.";
    return false;
  }
  error.value = undefined;
  return true;
}

function validaEmail() {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    error.value = "E-mail inválido.";
    return false;
  }
  error.value = undefined;
  return true;
}

const updateCliente = async () => {
  error.value = undefined; // limpa erro anterior

  if (
    !validaNome() ||
    !validaEndereco() ||
    !validaCPF() ||
    !validaTelefone() ||
    !validaEmail()
  ) {
    toast({
      title: "Erro no formulário",
      description: error.value,
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
        endereco: endereco.value,
        cpf: limparNumero(cpf.value),
        telefone: limparNumero(telefone.value),
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
      <Button
        variant="outline"
        class="transition-transform duration-200 hover:-translate-y-1"
      >
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
          <Label for="endereco" class="text-right"> Endereço </Label>
          <Input
            id="endereco"
            v-model="endereco"
            class="col-span-3"
            placeholder="Av Principal, 10 - Bairro Novo."
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="cpf" class="text-right"> CPF </Label>
          <Input
            id="cpf"
            v-model="cpf"
            v-mask="'###.###.###-##'"
            class="col-span-3"
            placeholder="000.000.000-00"
            maxlength="14"
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="telefone" class="text-right"> Telefone </Label>
          <Input
            id="telefone"
            v-model="telefone"
            v-mask="'(##) #####-####'"
            class="col-span-3"
            placeholder="(00) 00000-0000"
            maxlength="15"
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
