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
const senha = ref("");
const cargo = ref<string | "">("");
const open = ref(false);
const error = ref<string>();
const { toast } = useToast();
const emit = defineEmits(["funcionarioCriado"]);

const limparNumero = (valor: string) => valor.replace(/\D/g, "");

// Validações
function validaNome() {
  if (nome.value.trim().length < 3) {
    error.value = "Nome muito curto. Mínimo 3 caracteres.";
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
    error.value = "CPF inválido. Use o formato 000.000.000-00.";
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

function validaSenha() {
  if (senha.value.length < 6) {
    error.value = "Senha muito curta. Mínimo 6 caracteres.";
    return false;
  }
  error.value = undefined;
  return true;
}

function validaCargo() {
  if (!cargo.value) {
    error.value = "Selecione um cargo.";
    return false;
  }
  error.value = undefined;
  return true;
}

const createFuncionario = async () => {
  error.value = undefined;

  if (
    !validaNome() ||
    !validaCPF() ||
    !validaTelefone() ||
    !validaEmail() ||
    !validaSenha() ||
    !validaCargo()
  ) {
    toast({
      title: "Erro no formulário",
      description: error.value,
      variant: "destructive",
    });
    return;
  }

  try {
    await useFetch("/api/funcionarios/create", {
      method: "POST",
      body: {
        nome: nome.value,
        cpf: limparNumero(cpf.value),
        telefone: limparNumero(telefone.value),
        email: email.value,
        senha: senha.value,
        cargo: cargo.value,
      },
    });

    toast({
      title: "Funcionário cadastrado!",
      description: "O funcionário foi criado com sucesso.",
    });

    emit("funcionarioCriado");

    // Limpar campos
    nome.value = "";
    cpf.value = "";
    telefone.value = "";
    email.value = "";
    senha.value = "";
    cargo.value = "";
    open.value = false;
  } catch (error) {
    toast({
      title: "Erro ao criar funcionário",
      description: error instanceof Error ? error.message : "Tente novamente.",
      variant: "destructive",
    });
    console.error("Erro ao criar funcionário:", error);
  }
};
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button> Cadastrar funcionário </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Cadastrar Funcionário</DialogTitle>
        <DialogDescription>
          Preencha os campos abaixo para cadastrar um novo funcionário.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="nome" class="text-right"> Nome </Label>
          <Input
            id="nome"
            v-model="nome"
            class="col-span-3"
            placeholder="Digite o nome do funcionário"
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="cpf" class="text-right"> CPF </Label>
          <Input
            v-mask="'###.###.###-##'"
            id="cpf"
            v-model="cpf"
            class="col-span-3"
            placeholder="000.000.000-00"
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="telefone" class="text-right"> Telefone </Label>
          <Input
            id="telefone"
            v-model="telefone"
            v-mask="['(##) ####-####', '(##) #####-####']"
            class="col-span-3"
            placeholder="(00) 00000-0000"
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="email" class="text-right"> Email </Label>
          <Input
            id="email"
            type="email"
            v-model="email"
            class="col-span-3"
            placeholder="exemplo@email.com"
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="senha" class="text-right"> Senha </Label>
          <Input
            id="senha"
            type="password"
            v-model="senha"
            class="col-span-3"
            placeholder="Digite a senha"
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="cargo" class="text-right"> Cargo </Label>
          <select
            id="cargo"
            v-model="cargo"
            class="col-span-3 rounded border px-2 py-1"
          >
            <option disabled value="">Selecione o cargo</option>
            <option value="ADMINISTRADOR">ADMINISTRADOR</option>
            <option value="VENDEDOR">VENDEDOR</option>
            <option value="SERRALHEIRO">SERRALHEIRO</option>
            <option value="MONTADOR">MONTADOR</option>
            <option value="ENTREGADOR">ENTREGADOR</option>
          </select>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" @click="createFuncionario">
          Criar Funcionário
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
