<script lang="ts" setup>
import type { Pedido, Cliente } from "@prisma/client";
import { Pen } from "lucide-vue-next";
import { Button } from "../ui/button";
import { useToast } from "../ui/toast";

interface PedidoComCliente extends Pedido {
  cliente: Cliente;
}

const props = defineProps<{
  pedido: PedidoComCliente;
}>();

const open = ref(false);
const id = ref(props.pedido.id);
const clienteId = ref(props.pedido.clienteId.toString());
const descricao = ref(props.pedido.descricao);
const previsaoEntrega = ref(
  new Date(props.pedido.previsao_entrega).toISOString().split("T")[0]
);
const precoTotal = ref(props.pedido.preco_total.toString());
const desconto = ref(props.pedido.desconto.toString());
const error = ref<string>();
const { toast } = useToast();
const emit = defineEmits(["pedidoAtualizado"]);
const clientes = ref<{ id: number; nome: string }[]>([]);

// Buscar clientes ao abrir o modal
watch(open, async (novoValor) => {
  if (novoValor) {
    try {
      const { data } = await useFetch("/api/clientes/get-all");
      clientes.value = data.value || [];
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
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

const updatePedido = async () => {
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
    await $fetch("/api/pedidos/update", {
      method: "put",
      body: {
        id: id.value,
        clienteId: Number(clienteId.value),
        descricao: descricao.value,
        previsao_entrega: previsaoEntrega.value,
        preco_total: Number(precoTotal.value),
        desconto: Number(desconto.value) || 0,
      },
    });

    toast({
      title: "Pedido editado!",
      description: "O pedido foi editado com sucesso.",
    });

    emit("pedidoAtualizado");
    error.value = undefined;
    open.value = false;
  } catch (error) {
    toast({
      title: "Erro ao editar pedido",
      description: error instanceof Error ? error.message : "Erro inesperado.",
      variant: "destructive",
    });
    console.error("Erro ao editar pedido:", error);
  }
};
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button variant="outline" size="icon">
        <Pen class="h-4 w-4" />
      </Button>
    </DialogTrigger>

    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Editar Pedido</DialogTitle>
        <DialogDescription>
          Faça as alterações necessárias no pedido abaixo.
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
        <Button type="submit" @click="updatePedido">Salvar Alterações</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
