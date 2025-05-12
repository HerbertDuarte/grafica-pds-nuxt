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
        <!-- NOME -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="nome" class="text-right">Nome</Label>
          <Input
            id="nome"
            v-model="nome"
            class="col-span-3"
            placeholder="Digite o nome do cliente"
            @blur="validarCampo('nome')"
          />
        </div>

        <!-- CPF -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="cpf" class="text-right">CPF</Label>
          <Input
            id="cpf"
            v-model="cpf"
            v-mask="'###.###.###-##'"
            class="col-span-3"
            placeholder="000.000.000-00"
            maxlength="14"
            @blur="validarCampo('cpf')"
          />
        </div>

        <!-- TELEFONE -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="telefone" class="text-right">Telefone</Label>
          <Input
            id="telefone"
            v-model="telefone"
            v-mask="['(##) ####-####', '(##) #####-####']"
            class="col-span-3"
            placeholder="(00) 00000-0000"
            maxlength="15"
            @blur="validarCampo('telefone')"
          />
        </div>

        <!-- EMAIL -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="email" class="text-right">Email</Label>
          <Input
            id="email"
            v-model="email"
            class="col-span-3"
            placeholder="exemplo@email.com"
            @blur="validarCampo('email')"
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="submit" @click="createCliente">Criar Cliente</Button>
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
const error = ref<string>();
const { toast } = useToast();
const emit = defineEmits(["clienteCriado"]);

const validarCampo = (campo: string) => {
  switch (campo) {
    case "nome":
      error.value = nome.value.trim() ? "" : "Nome é obrigatório";
      break;
    case "cpf":
      error.value = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf.value)
        ? ""
        : "CPF inválido (use 000.000.000-00)";
      break;
    case "telefone":
      error.value = /^\(\d{2}\) \d{5}-\d{4}$/.test(telefone.value)
        ? ""
        : "Telefone inválido (use (00) 00000-0000)";
      break;
    case "email":
      error.value = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
        ? ""
        : "Email inválido";
      break;
  }
};

const validarTodos = () => {
  error.value = undefined;
  validarCampo("email");
  validarCampo("telefone");
  validarCampo("cpf");
  validarCampo("nome");

  return !!error
};

const limparNumero = (valor: string) => valor.replace(/\D/g, "");

const createCliente = async () => {
  if (!validarTodos()) {
    toast({
      title: "Erro no formulário",
      description: error.value,
      variant: "destructive",
    });
    return;
  }

  try {
    await useFetch("/api/clientes/create", {
      method: "POST",
      body: {
        nome: nome.value,
        cpf: limparNumero(cpf.value),
        telefone: limparNumero(telefone.value),
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
    error.value = undefined;
    open.value = false;
  } catch (error) {
    toast({
      title: "Erro ao criar cliente",
      description: error instanceof Error ? error.message : "Erro inesperado.",
      variant: "destructive",
    });
    console.error("Erro ao criar cliente:", error);
  }
};
</script>
