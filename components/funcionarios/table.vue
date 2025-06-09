<script setup lang="ts">
import type { Funcionario } from "@prisma/client";
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
  data: funcionarios,
  error,
  status,
  refresh,
} = useLazyFetch<Funcionario[]>("/api/funcionario/get-all");

const busca = ref("");
const realizarBusca = () => {
  changePage(1);
};

const funcionariosFiltrados = computed(() => {
  if (!funcionarios.value) return [];

  if (!busca.value.trim()) return funcionarios.value;

  const termoBusca = busca.value.toLowerCase().trim();
  return funcionarios.value.filter(
    (funcionario) =>
      funcionario.nome.toLowerCase().includes(termoBusca) ||
      funcionario.cpf.toLowerCase().includes(termoBusca) ||
      funcionario.telefone.toLowerCase().includes(termoBusca) ||
      funcionario.email.toLowerCase().includes(termoBusca) ||
      funcionario.id.toString().includes(termoBusca)
  );
});

const {
  itemsPerPage,
  currentPage,
  totalItems,
  totalPages,
  paginatedItems,
  changePage,
} = usePagination(funcionariosFiltrados, 10);

const refreshFuncionarios = () => {
  refresh();
};

watch(
  () => error,
  (newError) => {
    if (newError) {
      toast({
        title: "Erro ao buscar funcionários",
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
        <p>Tabela de funcionários</p>
      </div>
      <FuncionariosCreate @funcionario-criado="refreshFuncionarios" />
    </div>
    <div class="flex items-center gap-2">
      <SearchInput
        v-model="busca"
        placeholder="Pesquisar funcionário"
        @search="realizarBusca"
      />
    </div>
    <Table>
      <TableHeader>
        <TableRow class="bg-slate-100 font-bold">
          <TableHead>ID</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>CPF</TableHead>
          <TableHead>Telefone</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Cargo</TableHead>
          <TableHead class="text-right w-[200px]">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-if="status === 'pending'" colspan="7">
          <TableCell colspan="7" class="text-center py-4">
            <div class="flex justify-center items-center">
              <span class="text-slate-500">Carregando funcionários...</span>
            </div>
          </TableCell>
        </TableRow>
        <template v-else-if="paginatedItems?.length > 0">
          <TableRow v-for="funcionario in paginatedItems" :key="funcionario.id">
            <TableCell class="font-medium">{{ funcionario.id }}</TableCell>
            <TableCell>{{ funcionario.nome }}</TableCell>
            <TableCell>{{ funcionario.cpf }}</TableCell>
            <TableCell>{{ funcionario.telefone }}</TableCell>
            <TableCell>{{ funcionario.email }}</TableCell>
            <TableCell>
             <!--  {{ funcionario.cargo?.titulo || "—" }} --> <!-- IMPLEMENTAR CARGO -->
            </TableCell>
            <TableCell class="flex items-end justify-end w-[200px]">
              <div class="flex items-center gap-2">
                <FuncionariosUpdate
                  :funcionario="funcionario"
                  @funcionario-atualizado="refreshFuncionarios"
                />
                <FuncionariosDelete
                  :id="funcionario.id"
                  @funcionario-deletado="refreshFuncionarios"
                />
              </div>
            </TableCell>
          </TableRow>
        </template>
        <TableRow v-else>
          <TableCell colspan="7" class="text-center py-4">
            <div class="flex justify-center items-center">
              <span class="text-slate-500">Nenhum funcionário encontrado</span>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <div v-if="totalItems > 0" class="flex items-center justify-between">
      <p class="text-sm text-slate-500">
        <span v-if="status !== 'pending'">
          Página {{ currentPage }} de {{ totalPages || 1 }}
        </span>
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
