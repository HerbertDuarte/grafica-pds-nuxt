<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button> Cadastrar pedido </Button>
    </DialogTrigger>

    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Cadastrar Pedido</DialogTitle>
        <DialogDescription>
          Preencha os campos abaixo para cadastrar um novo pedido.
        </DialogDescription>
      </DialogHeader>

      <div class="grid gap-4 py-4">
        <!-- CLIENTE -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="cliente" class="text-right">Cliente</Label>
          <select
            id="cliente"
            v-model="clienteId"
            class="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Selecione um cliente</option>
            <option
              v-for="cliente in clientes"
              :key="cliente.id"
              :value="cliente.id"
            >
              {{ cliente.nome }}
            </option>
          </select>
        </div>

        <!-- DESCRIÇÃO -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="descricao" class="text-right">Descrição</Label>
          <Input
            id="descricao"
            v-model="descricao"
            class="col-span-3"
            placeholder="Descrição do pedido"
          />
        </div>

        <!-- PREVISÃO DE ENTREGA -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="previsao_entrega" class="text-right"
            >Previsão de Entrega</Label
          >
          <Input
            id="previsao_entrega"
            v-model="previsaoEntrega"
            type="date"
            class="col-span-3"
          />
        </div>

        <!-- PREÇO TOTAL -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="preco_total" class="text-right">Preço Total</Label>
          <Input
            id="preco_total"
            v-model="precoTotal"
            type="number"
            step="0.01"
            class="col-span-3"
            placeholder="0.00"
          />
        </div>

        <!-- DESCONTO -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="desconto" class="text-right">Desconto</Label>
          <Input
            id="desconto"
            v-model="desconto"
            type="number"
            step="0.01"
            class="col-span-3"
            placeholder="0.00"
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="submit" @click="createPedido">Criar Pedido</Button>
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

const clienteId = ref("");
const descricao = ref("");
const previsaoEntrega = ref("");
const precoTotal = ref("");
const desconto = ref("");
const open = ref(false);
const error = ref<string>();
const { toast } = useToast();
const emit = defineEmits(["pedidoCriado"]);
const clientes = ref<{ id: number; nome: string }[]>([]);

// Buscar clientes ao montar o componente
onMounted(async () => {
  try {
    const { data } = await useFetch("/api/clientes/get-all");
    clientes.value = data.value || [];
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
  }
});

// Validações individuais
function validaCliente() {
  if (!clienteId.value) {
    error.value = "Cliente é obrigatório.";
    return false;
  }
  return true;
}

function validaDescricao() {
  if (descricao.value.trim().length < 3) {
    error.value =
      "Descrição muito curta. A descrição precisa ter no mínimo 3 caracteres.";
    return false;
  }
  return true;
}

function validaPrevisaoEntrega() {
  if (!previsaoEntrega.value) {
    error.value = "Previsão de entrega é obrigatória.";
    return false;
  }
  const dataEntrega = new Date(previsaoEntrega.value);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  if (dataEntrega < hoje) {
    error.value = "A previsão de entrega não pode ser anterior à data atual.";
    return false;
  }
  return true;
}

function validaPrecoTotal() {
  if (!precoTotal.value || Number(precoTotal.value) <= 0) {
    error.value = "Preço total deve ser maior que zero.";
    return false;
  }
  return true;
}

function validaDesconto() {
  if (desconto.value && Number(desconto.value) < 0) {
    error.value = "Desconto não pode ser negativo.";
    return false;
  }
  return true;
}

const createPedido = async () => {
  if (
    !validaCliente() ||
    !validaDescricao() ||
    !validaPrevisaoEntrega() ||
    !validaPrecoTotal() ||
    !validaDesconto()
  ) {
    toast({
      title: "Erro no formulário",
      description: error.value,
      variant: "destructive",
    });
    return;
  }

  try {
    await useFetch("/api/pedidos/create", {
      method: "POST",
      body: {
        clienteId: Number(clienteId.value),
        descricao: descricao.value,
        previsao_entrega: previsaoEntrega.value,
        preco_total: Number(precoTotal.value),
        desconto: Number(desconto.value) || 0,
      },
    });

    toast({
      title: "Pedido cadastrado!",
      description: "O pedido foi criado com sucesso.",
    });

    emit("pedidoCriado");

    clienteId.value = "";
    descricao.value = "";
    previsaoEntrega.value = "";
    precoTotal.value = "";
    desconto.value = "";
    error.value = undefined;
    open.value = false;
  } catch (error) {
    toast({
      title: "Erro ao criar pedido",
      description: error instanceof Error ? error.message : "Erro inesperado.",
      variant: "destructive",
    });
    console.error("Erro ao criar pedido:", error);
  }
};
</script>
