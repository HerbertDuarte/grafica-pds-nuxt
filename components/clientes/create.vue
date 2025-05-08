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

        <!-- CPF -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="cpf" class="text-right">CPF</Label>
          <div class="col-span-3">
            <Input
              id="cpf"
              v-model="cpf"
              placeholder="000.000.000-00"
              @input="formatarCPF"
              @blur="validarCampo('cpf')"
            />
            <p v-if="erros.cpf" class="text-red-500 text-sm mt-1">{{ erros.cpf }}</p>
          </div>
        </div>

        <!-- TELEFONE -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="telefone" class="text-right">Telefone</Label>
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

        <!-- EMAIL -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="email" class="text-right">Email</Label>
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
const erros = ref<{ [key: string]: string }>({});
const { toast } = useToast();
const emit = defineEmits(["clienteCriado"]);

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

const createCliente = async () => {
  if (!validarTodos()) {
    toast({
      title: "Erro no formulário",
      description: "Preencha todos os campos corretamente.",
      variant: "destructive",
    });
    return;
  }

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
    erros.value = {};
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
