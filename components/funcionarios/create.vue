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
            placeholder="Digite o CPF"
            required
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="telefone" class="text-right"> Telefone </Label>
          <Input
            id="telefone"
            v-model="telefone"
            v-mask="['(##) ####-####', '(##) #####-####']"
            class="col-span-3"
            placeholder="Digite o telefone"
            required
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="email" class="text-right"> Email </Label>
          <Input
            id="email"
            type="email"
            v-model="email"
            class="col-span-3"
            placeholder="Digite o email"
            required
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
            required
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="cargo" class="text-right"> Cargo </Label>
          <select
            id="cargo"
            v-model="cargo"
            class="col-span-3 rounded border px-2 py-1"
            required
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

<script setup lang="ts">
import { ref, onMounted } from "vue";
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
const { toast } = useToast();
const emit = defineEmits(["funcionarioCriado"]);

const createFuncionario = async () => {
  if (!cargo.value) {
    toast({
      title: "Erro",
      description: "Por favor, selecione um cargo.",
      variant: "destructive",
    });
    return;
  }

  try {
    await useFetch("/api/funcionarios/create", {
      method: "POST",
      body: {
        nome: nome.value,
        cpf: cpf.value,
        telefone: telefone.value,
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

    nome.value = "";
    cpf.value = "";
    telefone.value = "";
    email.value = "";
    senha.value = "";
    cargo.value = "";

    open.value = false;
  } catch (error) {
    if (error instanceof Error) {
      toast({
        title: "Erro ao criar funcionário",
        description: error.message || "Tente novamente.",
        variant: "destructive",
      });
      console.error("Erro ao criar funcionário:", error);
    }
  }
};
</script>

<style scoped></style>
