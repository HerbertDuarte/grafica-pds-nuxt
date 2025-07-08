<script setup lang="ts">
import type { FichaProducao } from "@prisma/client";
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

type FichaProducaoCompleta = FichaProducao & {
  pedido: {
    id: number;
    descricao: string;
    cliente: {
      nome: string;
    };
  };
  funcionario: {
    nome: string;
  };
  tarefa: {
    id: number;
    nome: string;
    isObrigatorio: boolean;
  };
  produtos: Array<{
    produto: {
      nome: string;
      preco: number;
    };
    quantidade: number;
  }>;
};

const { toast } = useToast();
const {
  data: fichasProducao,
  error,
  status,
  refresh,
} = useLazyFetch<FichaProducaoCompleta[]>("/api/ficha-producao/get-all");

const busca = ref("");
const realizarBusca = () => {
  changePage(1);
};

const fichasProducaoFiltradas = computed(() => {
  if (!fichasProducao.value) return [];

  if (!busca.value.trim()) return fichasProducao.value;

  const termoBusca = busca.value.toLowerCase().trim();
  return fichasProducao.value.filter(
    (ficha) =>
      ficha.descricao.toLowerCase().includes(termoBusca) ||
      ficha.id.toString().includes(termoBusca) ||
      ficha.pedido?.descricao.toLowerCase().includes(termoBusca) ||
      ficha.funcionario?.nome.toLowerCase().includes(termoBusca) ||
      ficha.tarefa?.nome.toLowerCase().includes(termoBusca)
  );
});

const {
  itemsPerPage,
  currentPage,
  totalItems,
  totalPages,
  paginatedItems,
  changePage,
} = usePagination(fichasProducaoFiltradas, 10);

const refreshFichasProducao = () => {
  refresh();
};

function formatarData(data: string) {
  return new Date(data).toLocaleDateString("pt-BR");
}

function formatarDataHora(data: string) {
  return new Date(data).toLocaleString("pt-BR");
}

watch(
  () => error,
  (newError) => {
    if (newError) {
      toast({
        title: "Erro ao buscar fichas de produção",
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
        <p>Tabela de fichas de produção</p>
      </div>
      <FichaProducaoCreate @ficha-producao-criada="refreshFichasProducao" />
    </div>
    <div class="flex items-center gap-2">
      <SearchInput
        v-model="busca"
        placeholder="Pesquisar ficha de produção"
        @search="realizarBusca"
      />
    </div>
    <Table>
      <TableHeader>
        <TableRow class="bg-slate-100 font-bold">
          <TableHead class="font-bold">ID</TableHead>
          <TableHead class="font-bold">Descrição</TableHead>
          <TableHead class="font-bold">Pedido</TableHead>
          <TableHead class="font-bold">Tarefa</TableHead>
          <TableHead class="font-bold">Funcionário</TableHead>
          <TableHead class="font-bold">Produtos</TableHead>
          <TableHead class="font-bold">Entrega</TableHead>
          <TableHead class="font-bold">Criado em</TableHead>
          <TableHead class="font-bold text-right w-[200px]">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-if="status === 'pending'" colspan="9">
          <TableCell colspan="9" class="text-center py-4">
            <div class="flex justify-center items-center">
              <span class="text-slate-500"
                >Carregando fichas de produção...</span
              >
            </div>
          </TableCell>
        </TableRow>
        <template v-else-if="paginatedItems?.length > 0">
          <TableRow v-for="ficha in paginatedItems" :key="ficha.id">
            <TableCell class="font-medium">
              {{ ficha.id }}
            </TableCell>
            <TableCell>{{ ficha.descricao }}</TableCell>
            <TableCell>
              #{{ ficha.pedido?.id }} - {{ ficha.pedido?.descricao }}
            </TableCell>
            <TableCell>{{ ficha.tarefa?.nome || "Sem tarefa" }}</TableCell>
            <TableCell>{{ ficha.funcionario?.nome }}</TableCell>
            <TableCell>
              <div class="max-w-[200px]">
                <div
                  v-if="ficha.produtos && ficha.produtos.length > 0"
                  class="flex flex-wrap gap-1"
                >
                  <span
                    v-for="(produtoRel, index) in ficha.produtos"
                    :key="index"
                    class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                  >
                    {{ produtoRel.produto.nome }} ({{ produtoRel.quantidade }}x)
                  </span>
                </div>
                <span v-else class="text-slate-400 text-sm"
                  >Nenhum produto</span
                >
              </div>
            </TableCell>
            <TableCell>{{ formatarDataHora(ficha.entrega) }}</TableCell>
            <TableCell>{{ formatarData(ficha.createdAt) }}</TableCell>
            <TableCell class="flex items-end justify-end w-[200px]">
              <div class="flex items-center gap-2">
                <FichaProducaoUpdate
                  :ficha-producao="ficha"
                  @ficha-producao-atualizada="refreshFichasProducao"
                />
                <FichaProducaoDelete
                  :id="ficha.id"
                  @ficha-producao-deletada="refreshFichasProducao"
                />
              </div>
            </TableCell>
          </TableRow>
        </template>
        <TableRow v-else>
          <TableCell colspan="9" class="text-center py-4">
            <div class="flex justify-center items-center">
              <span class="text-slate-500"
                >Nenhuma ficha de produção encontrada</span
              >
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
