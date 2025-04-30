<script setup lang="ts">
import type { Produto } from "@prisma/client";
import { useToast } from "@/components/ui/toast/use-toast";
import {
  Table,
  TableCaption,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import SearchInput from "../custom/search-input.vue";

const { toast } = useToast();
const {
  data: produtos,
  error,
  status,
  refresh,
} = useLazyFetch<Produto[]>("/api/produto/get-all");

const busca = ref("");
const realizarBusca = () => {
  changePage(1);
};

const produtosFiltrados = computed(() => {
  if (!produtos.value) return [];

  if (!busca.value.trim()) return produtos.value;

  const termoBusca = busca.value.toLowerCase().trim();
  return produtos.value.filter(
    (produto) =>
      produto.nome.toLowerCase().includes(termoBusca) ||
      produto.descricao?.toLowerCase().includes(termoBusca) ||
      produto.id.toString().includes(termoBusca) ||
      produto.preco.toString().includes(termoBusca)
  );
});

const {
  itemsPerPage,
  currentPage,
  totalItems,
  totalPages,
  paginatedItems,
  changePage,
} = usePagination(produtosFiltrados, 10);

const refreshProdutos = () => {
  refresh();
};

watch(
  () => error,
  (newError) => {
    if (newError) {
      toast({
        title: "Erro ao buscar produtos",
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
        <p>Tabela de produtos</p>
      </div>
      <ProdutosCreate @produtoCriado="refreshProdutos" />
    </div>
    <div class="flex items-center gap-2">
      <SearchInput
        v-model="busca"
        placeholder="Pesquisar produto"
        @search="realizarBusca"
      />
    </div>
    <Table>
      <TableHeader>
        <TableRow class="bg-slate-100 font-bold">
          <TableHead class="font-bold"> ID </TableHead>
          <TableHead class="font-bold">Nome</TableHead>
          <TableHead class="font-bold">Preço</TableHead>
          <TableHead class="font-bold"> Descrição </TableHead>
          <TableHead class="font-bold "> Ações </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-if="status === 'pending'" colspan="4">
          <TableCell colspan="4" class="text-center py-4">
            <div class="flex justify-center items-center">
              <span class="text-slate-500">Carregando produtos...</span>
            </div>
          </TableCell >
        </TableRow>
        <template v-else-if="paginatedItems?.length > 0">
          <TableRow v-for="produto in paginatedItems" :key="produto.id">
            <TableCell class="font-medium">
              {{ produto.id }}
            </TableCell>
            <TableCell>{{ produto.nome }}</TableCell>
            <TableCell>{{ produto.preco }}</TableCell>
            <TableCell>
              {{ produto.descricao }}
            </TableCell>
            <TableCell>
              <div class="flex items-center gap-2">
                <ProdutosUpdate :produto="produto" @produtoAtualizado="refreshProdutos" />
                <ProdutosDelete :id="produto.id" @produtoDeletado="refreshProdutos" />
              </div>
            </TableCell>
          </TableRow>
        </template>
        <TableRow v-else>
          <TableCell colspan="4" class="text-center py-4">
            <div class="flex justify-center items-center">
              <span class="text-slate-500">Nenhum produto encontrado</span>
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
