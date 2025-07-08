<script setup lang="ts">
import type { Pedido, Cliente } from "@prisma/client";
import { useToast } from "@/components/ui/toast/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import SearchInput from "../custom/search-input.vue";

interface PedidoComCliente extends Pedido {
  cliente: Cliente;
}

const { toast } = useToast();
const {
  data: pedidos,
  error,
  status,
  refresh,
} = useLazyFetch<PedidoComCliente[]>("/api/pedidos/get-all");

const busca = ref("");
const realizarBusca = () => {
  changePage(1);
};

const pedidosFiltrados = computed(() => {
  if (!pedidos.value) return [];

  if (!busca.value.trim()) return pedidos.value;

  const termoBusca = busca.value.toLowerCase().trim();
  return pedidos.value.filter(
    (pedido) =>
      pedido.descricao.toLowerCase().includes(termoBusca) ||
      pedido.cliente.nome.toLowerCase().includes(termoBusca) ||
      pedido.id.toString().includes(termoBusca) ||
      pedido.preco_total.toString().includes(termoBusca)
  );
});

const {
  itemsPerPage,
  currentPage,
  totalItems,
  totalPages,
  paginatedItems,
  changePage,
} = usePagination(pedidosFiltrados, 10);

const refreshPedidos = () => {
  refresh();
};

function formatarData(data: string | Date) {
  if (!data) return "";
  const date = new Date(data);
  return date.toLocaleDateString("pt-BR");
}

function formatarPreco(preco: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(preco);
}

function getStatusEntrega(previsaoEntrega: string | Date) {
  const hoje = new Date();
  const dataEntrega = new Date(previsaoEntrega);

  if (dataEntrega < hoje) {
    return { texto: "Atrasado", classe: "text-red-600 font-medium" };
  } else if (dataEntrega.toDateString() === hoje.toDateString()) {
    return { texto: "Hoje", classe: "text-yellow-600 font-medium" };
  } else {
    return { texto: "No prazo", classe: "text-green-600 font-medium" };
  }
}

watch(
  () => error,
  (newError) => {
    if (newError) {
      toast({
        title: "Erro ao buscar pedidos",
        variant: "destructive",
      });
    }
  }
);

watch(busca, () => {
  changePage(1);
});
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-start justify-between">
      <div>
        <p>Tabela de pedidos</p>
      </div>
      <PedidosCreate @pedido-criado="refreshPedidos" />
    </div>
    <div class="flex items-center gap-2">
      <SearchInput
        v-model="busca"
        placeholder="Pesquisar pedido"
        @search="realizarBusca"
      />
    </div>
    <Table>
      <TableHeader>
        <TableRow class="bg-slate-100 font-bold">
          <TableHead class="font-bold">ID</TableHead>
          <TableHead class="font-bold">Descrição</TableHead>
          <TableHead class="font-bold">Cliente</TableHead>
          <TableHead class="font-bold">Preço Total</TableHead>
          <TableHead class="font-bold">Desconto</TableHead>
          <TableHead class="font-bold">Previsão de Entrega</TableHead>
          <TableHead class="font-bold">Status</TableHead>
          <TableHead class="font-bold text-right w-[200px]">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-if="status === 'pending'" colspan="8">
          <TableCell colspan="8" class="text-center py-4">
            <div class="flex justify-center items-center">
              <span class="text-slate-500">Carregando pedidos...</span>
            </div>
          </TableCell>
        </TableRow>
        <template v-else-if="paginatedItems?.length > 0">
          <TableRow v-for="pedido in paginatedItems" :key="pedido.id">
            <TableCell class="font-medium">
              {{ pedido.id }}
            </TableCell>
            <TableCell>{{ pedido.descricao }}</TableCell>
            <TableCell>{{ pedido.cliente.nome }}</TableCell>
            <TableCell>{{ formatarPreco(pedido.preco_total) }}</TableCell>
            <TableCell>{{ formatarPreco(pedido.desconto) }}</TableCell>
            <TableCell>{{ formatarData(pedido.previsao_entrega) }}</TableCell>
            <TableCell>
              <span :class="getStatusEntrega(pedido.previsao_entrega).classe">
                {{ getStatusEntrega(pedido.previsao_entrega).texto }}
              </span>
            </TableCell>
            <TableCell class="flex items-end justify-end w-[200px]">
              <div class="flex items-center gap-2">
                <PedidosUpdate
                  :pedido="pedido"
                  @pedido-atualizado="refreshPedidos"
                />
                <PedidosDelete
                  :id="pedido.id"
                  @pedido-deletado="refreshPedidos"
                />
              </div>
            </TableCell>
          </TableRow>
        </template>
        <TableRow v-else>
          <TableCell colspan="8" class="text-center py-4">
            <div class="flex justify-center items-center">
              <span class="text-slate-500">Nenhum pedido encontrado</span>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <div v-if="totalItems > 0" class="flex items-center justify-between">
      <p class="text-sm text-slate-500">
        <span v-if="status !== 'pending'">
          Página {{ currentPage }} de {{ totalPages || 1 }}</span
        >
        <span v-else>Página 1/...</span>
      </p>
      <CustomPaginator
        :change-page="changePage"
        :items-per-page="itemsPerPage"
        :total-items="totalItems"
        :current-page="currentPage"
      />
    </div>
  </div>
</template>
