<script setup lang="ts">
import type { Cliente } from "@prisma/client";
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
  data: clientes,
  error,
  status,
  refresh,
} = useLazyFetch<Cliente[]>("/api/clientes/get-all");

const busca = ref("");
const realizarBusca = () => {
  changePage(1);
};

const clientesFiltrados = computed(() => {
  if (!clientes.value) return [];

  if (!busca.value.trim()) return clientes.value;

  const termoBusca = busca.value.toLowerCase().trim();
  return clientes.value.filter(
    (cliente) =>
      cliente.nome.toLowerCase().includes(termoBusca) ||
      cliente.email?.toLowerCase().includes(termoBusca) ||
      cliente.id.toString().includes(termoBusca) ||
      cliente.cpf.toLowerCase().includes(termoBusca) ||
      cliente.telefone.toString().includes(termoBusca)
  );
});

const {
  itemsPerPage,
  currentPage,
  totalItems,
  totalPages,
  paginatedItems,
  changePage,
} = usePagination(clientesFiltrados, 10);

const refreshClientes = () => {
  refresh();
};


function formatarCPFExibicao(cpf: string) {
  if (!cpf) return "";
  cpf = cpf.replace(/\D/g, "");
  if (cpf.length !== 11) return cpf;
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatarTelefoneExibicao(telefone: string) {
  if (!telefone) return "";
  telefone = telefone.replace(/\D/g, "");
  if (telefone.length !== 11) return telefone;
  return telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
}

watch(
  () => error,
  (newError) => {
    if (newError) {
      toast({
        title: "Erro ao buscar clientes",
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
        <p>Tabela de clientes</p>
      </div>
      <ClientesCreate @clienteCriado="refreshClientes" />
    </div>
    <div class="flex items-center gap-2">
      <SearchInput
        v-model="busca"
        placeholder="Pesquisar cliente"
        @search="realizarBusca"
      />
    </div>
    <Table>
      <TableHeader>
        <TableRow class="bg-slate-100 font-bold">
          <TableHead class="font-bold"> ID </TableHead>
          <TableHead class="font-bold">Nome</TableHead>
          <TableHead class="font-bold">CPF</TableHead>
          <TableHead class="font-bold">Email</TableHead>
          <TableHead class="font-bold">Telefone</TableHead>
          <TableHead class="font-bold text-right w-[200px]">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-if="status === 'pending'" colspan="6">
          <TableCell colspan="6" class="text-center py-4">
            <div class="flex justify-center items-center">
              <span class="text-slate-500">Carregando clientes...</span>
            </div>
          </TableCell>
        </TableRow>
        <template v-else-if="paginatedItems?.length > 0">
          <TableRow v-for="cliente in paginatedItems" :key="cliente.id">
            <TableCell class="font-medium">
              {{ cliente.id }}
            </TableCell>
            <TableCell>{{ cliente.nome }}</TableCell>
            <TableCell>{{ formatarCPFExibicao(cliente.cpf) }}</TableCell>
            <TableCell>{{ cliente.email }}</TableCell>
            <TableCell>
              {{ formatarTelefoneExibicao(cliente.telefone) }}
            </TableCell>
            <TableCell class="flex items-end justify-end w-[200px]">
              <div class="flex items-center gap-2">
                <ClientesUpdate
                  :cliente="cliente"
                  @clienteAtualizado="refreshClientes"
                />
                <ClientesDelete
                  :id="cliente.id"
                  @clienteDeletado="refreshClientes"
                />
              </div>
            </TableCell>
          </TableRow>
        </template>
        <TableRow v-else>
          <TableCell colspan="6" class="text-center py-4">
            <div class="flex justify-center items-center">
              <span class="text-slate-500">Nenhum cliente encontrado</span>
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