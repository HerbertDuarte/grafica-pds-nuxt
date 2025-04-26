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
import { Button } from "@/components/ui/button";

const { toast } = useToast();
const {
  data: produtos,
  error,
  status,
} = useFetch<Produto[]>("/api/produto/get-all");

const {
  itemsPerPage,
  currentPage,
  totalItems,
  totalPages,
  paginatedItems,
  changePage,
} = usePagination(produtos, 3);

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
</script>
<template>
  <div class="p-8 border rounded-xl space-y-4">
    <div class="flex items-start justify-between">
      <p>Tabela de produtos</p>
      <Button>Cadastrar produto</Button>
    </div>

    <Table>
      <TableCaption
        v-if="status !== 'pending' && produtos && produtos.length === 0"
      >
        Nenhum produto para ser listado.
      </TableCaption>
      <TableHeader>
        <TableRow class="bg-slate-100 font-bold">
          <TableHead class="font-bold"> ID </TableHead>
          <TableHead class="font-bold">Nome</TableHead>
          <TableHead class="font-bold">Preço</TableHead>
          <TableHead class="font-bold"> Descrição </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-if="status === 'pending'" colspan="4">
          <TableCell colspan="4" class="text-center py-4">
            <div class="flex justify-center items-center">
              <span class="text-slate-500">Carregando produtos...</span>
            </div>
          </TableCell>
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
        Página {{ currentPage }} de
        {{ totalPages || 1 }}
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
