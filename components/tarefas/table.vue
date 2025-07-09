<script setup lang="ts">
import type { Tarefa } from "@prisma/client";
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

const { toast } = useToast();
const {
  data: tarefas,
  error,
  status,
  refresh,
} = useLazyFetch<Tarefa[]>("/api/tarefa/get-all");

const busca = ref("");
const realizarBusca = () => changePage(1);

const tarefasFiltradas = computed(() => {
  if (!tarefas.value) return [];
  if (!busca.value.trim()) return tarefas.value;
  const termoBusca = busca.value.toLowerCase().trim();
  return tarefas.value.filter(
    (t) =>
      t.nome.toLowerCase().includes(termoBusca) ||
      t.descricao.toLowerCase().includes(termoBusca) ||
      t.id.toString().includes(termoBusca)
  );
});

const {
  itemsPerPage,
  currentPage,
  totalItems,
  totalPages,
  paginatedItems,
  changePage,
} = usePagination(tarefasFiltradas, 10);

const refreshTarefas = () => refresh();

watch(
  () => error,
  (newError) => {
    if (newError) {
      toast({ title: "Erro ao buscar tarefas", variant: "destructive" });
    }
  }
);
watch(busca, () => changePage(1));
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-start justify-between">
      <div><p>Tabela de tarefas</p></div>
      <TarefasCreate @tarefaCriada="refreshTarefas" />
    </div>
    <div class="flex items-center gap-2">
      <SearchInput
        v-model="busca"
        placeholder="Pesquisar tarefa"
        @search="realizarBusca"
      />
    </div>
    <Table>
      <TableHeader>
        <TableRow class="bg-slate-100 font-bold">
          <TableHead>ID</TableHead>
          <TableHead>Nome</TableHead>
          <!-- <TableHead>Obrigatória?</TableHead>
          <TableHead>Simultânea?</TableHead> -->
          <TableHead>Descrição</TableHead>
          <TableHead class="text-right w-[200px]">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-if="status === 'pending'" colspan="6">
          <TableCell colspan="6" class="text-center py-4">
            <span class="text-slate-500">Carregando tarefas...</span>
          </TableCell>
        </TableRow>
        <template v-else-if="paginatedItems?.length > 0">
          <TableRow v-for="tarefa in paginatedItems" :key="tarefa.id">
            <TableCell>{{ tarefa.id }}</TableCell>
            <TableCell>{{ tarefa.nome }}</TableCell>
            <!-- <TableCell>{{ tarefa.isObrigatorio ? "Sim" : "Não" }}</TableCell>
            <TableCell>{{ tarefa.isSimultanea ? "Sim" : "Não" }}</TableCell> -->
            <TableCell>{{ tarefa.descricao }}</TableCell>
            <TableCell class="flex items-end justify-end w-[200px]">
              <div class="flex items-center gap-2">
                <TarefasUpdate
                  :tarefa="tarefa"
                  @tarefaAtualizada="refreshTarefas"
                />
                <TarefasDelete
                  :id="tarefa.id"
                  @tarefaDeletada="refreshTarefas"
                />
              </div>
            </TableCell>
          </TableRow>
        </template>
        <TableRow v-else>
          <TableCell colspan="6" class="text-center py-4">
            <span class="text-slate-500">Nenhuma tarefa encontrada</span>
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
