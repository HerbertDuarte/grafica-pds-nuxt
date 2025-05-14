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
const endereco = ref(props.cliente.endereco ?? ""); 
const erros = ref<{ [key: string]: string }>({});
const { toast } = useToast(); 
const emit = defineEmits(["clienteAtualizado"]);

const formatarCPF = (e: Event) => {
  let value = (e.target as HTMLInputElement).value.replace(/\D/g, "").slice(0, 11);
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  cpf.value = value;
};

const formatarTelefone = (e: Event) => {
  let value = (e.target as HTMLInputElement).value.replace(/\D/g, "").slice(0, 11);
  value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
  value = value.replace(/(\d{5})(\d)/, "$1-$2");
  telefone.value = value;
};

// Função para limpar caracteres especiais antes de salvar no banco
const limparNumero = (valor: string) => valor.replace(/\D/g, "");

const validarCampo = (campo: string) => {
  switch (campo) {
    case "nome":
      erros.value.nome = nome.value.trim() ? "" : "Nome é obrigatório";
      break;
    case "endereco":
      erros.value.endereco = endereco.value.trim()
        ? ""
        : "Endereço é obrigatório";
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
  validarCampo("endereco");
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
        cpf: limparNumero(cpf.value),
        telefone: limparNumero(telefone.value),
        email: email.value,
        endereco: endereco.value,
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
            @blur="validarCampo('nome')"
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="endereco" class="text-right"> Endereço </Label>
          <Input
            id="endereco"
            v-model="endereco"
            class="col-span-3"
            placeholder="Digite o endereço do cliente"
            @blur="validarCampo('endereco')"
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
            @blur="validarCampo('cpf')"
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
            @blur="validarCampo('telefone')"
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="email" class="text-right"> Email </Label>
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
        <Button type="submit" @click="updateCliente"> Editar Cliente </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>