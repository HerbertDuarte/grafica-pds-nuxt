<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button> Cadastrar Ficha de Produção </Button>
    </DialogTrigger>

    <DialogContent class="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Cadastrar Ficha de Produção</DialogTitle>
        <DialogDescription>
          Preencha os campos abaixo para cadastrar uma nova ficha de produção.
        </DialogDescription>
      </DialogHeader>

      <div class="grid gap-4 py-4">
        <!-- DESCRIÇÃO -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="descricao" class="text-right">Descrição</Label>
          <Input
            id="descricao"
            v-model="descricao"
            class="col-span-3"
            placeholder="Descrição da ficha de produção"
          />
        </div>

        <!-- PEDIDO -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="pedido" class="text-right">Pedido</Label>
          <select
            id="pedido"
            v-model="pedidoId"
            class="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Selecione um pedido</option>
            <option
              v-for="pedido in pedidos"
              :key="pedido.id"
              :value="pedido.id"
            >
              #{{ pedido.id }} - {{ pedido.cliente.nome }} -
              {{ pedido.descricao }}
            </option>
          </select>
        </div>

        <!-- FUNCIONÁRIO -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="funcionario" class="text-right">Funcionário</Label>
          <select
            id="funcionario"
            v-model="funcionarioId"
            class="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Selecione um funcionário</option>
            <option
              v-for="funcionario in funcionarios"
              :key="funcionario.id"
              :value="funcionario.id"
            >
              {{ funcionario.nome }} - {{ funcionario.cargo }}
            </option>
          </select>
        </div>

        <!-- PRODUTOS -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="produtos" class="text-right">Produtos</Label>
          <div class="col-span-3">
            <div class="max-h-40 overflow-y-auto border rounded-md p-2">
              <div
                v-for="produto in produtos"
                :key="produto.id"
                class="flex items-center justify-between space-x-2 mb-2 p-2 border rounded"
              >
                <div class="flex items-center space-x-2">
                  <label :for="`produto-${produto.id}`" class="text-sm">
                    {{ produto.nome }} -
                    {{
                      new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(produto.preco)
                    }}
                  </label>
                </div>
                <div class="flex items-center space-x-2">
                  <Label class="text-xs">Qtd:</Label>
                  <div class="flex items-center space-x-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      class="h-6 w-6 p-0"
                      @click="decrementarQuantidade(produto.id)"
                    >
                      -
                    </Button>
                    <span class="w-8 text-center text-sm">
                      {{
                        produtosSelecionados.find((p) => p.id === produto.id)
                          ?.quantidade || 0
                      }}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      class="h-6 w-6 p-0"
                      @click="incrementarQuantidade(produto.id)"
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- DATA DE ENTREGA -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="entrega" class="text-right">Data de Entrega</Label>
          <Input
            id="entrega"
            v-model="entrega"
            type="datetime-local"
            class="col-span-3"
          />
        </div>

        <!-- TAREFAS -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="tarefas" class="text-right">Tarefas</Label>
          <div class="col-span-3">
            <div class="max-h-32 overflow-y-auto border rounded-md p-2">
              <div
                v-for="tarefa in tarefas"
                :key="tarefa.id"
                class="flex items-center space-x-2 mb-2"
              >
                <input
                  :id="`tarefa-${tarefa.id}`"
                  v-model="tarefasSelecionadas"
                  :value="tarefa.id"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label :for="`tarefa-${tarefa.id}`" class="text-sm">
                  {{ tarefa.nome }}
                  <span v-if="tarefa.isObrigatorio" class="text-red-500"
                    >*</span
                  >
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="submit" @click="createFichaProducao"
          >Criar Ficha de Produção</Button
        >
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

const descricao = ref("");
const pedidoId = ref("");
const funcionarioId = ref("");
const entrega = ref("");
const tarefasSelecionadas = ref<number[]>([]);
const produtosSelecionados = ref<Array<{ id: number; quantidade: number }>>([]);
const open = ref(false);
const error = ref<string>();

const pedidos = ref<
  Array<{ id: number; descricao: string; cliente: { nome: string } }>
>([]);
const funcionarios = ref<Array<{ id: number; nome: string; cargo: string }>>(
  []
);
const tarefas = ref<
  Array<{ id: number; nome: string; isObrigatorio: boolean }>
>([]);
const produtos = ref<Array<{ id: number; nome: string; preco: number }>>([]);

const { toast } = useToast();
const emit = defineEmits(["fichaProducaoCriada"]);

onMounted(async () => {
  await carregarDados();
});

const carregarDados = async () => {
  try {
    const [pedidosData, funcionariosData, tarefasData, produtosData] =
      await Promise.all([
        $fetch("/api/pedidos/get-all"),
        $fetch("/api/funcionarios/get-all"),
        $fetch("/api/tarefa/get-all"),
        $fetch("/api/produto/get-all"),
      ]);

    pedidos.value = pedidosData;
    funcionarios.value = funcionariosData;
    tarefas.value = tarefasData;
    produtos.value = produtosData;
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    toast({
      title: "Erro",
      description: "Erro ao carregar dados necessários",
      variant: "destructive",
    });
  }
};

// Funções para gerenciar produtos
const incrementarQuantidade = (produtoId: number) => {
  const produto = produtosSelecionados.value.find((p) => p.id === produtoId);
  if (produto) {
    produto.quantidade++;
  } else {
    produtosSelecionados.value.push({ id: produtoId, quantidade: 1 });
  }
};

const decrementarQuantidade = (produtoId: number) => {
  const index = produtosSelecionados.value.findIndex((p) => p.id === produtoId);
  if (index !== -1) {
    const produto = produtosSelecionados.value[index];
    if (produto.quantidade > 1) {
      produto.quantidade--;
    } else {
      produtosSelecionados.value.splice(index, 1);
    }
  }
};

// Validações
function validaDescricao() {
  if (descricao.value.trim().length < 3) {
    error.value =
      "Descrição muito curta. A descrição precisa ter no mínimo 3 caracteres.";
    return false;
  }
  return true;
}

function validaPedido() {
  if (!pedidoId.value) {
    error.value = "Selecione um pedido.";
    return false;
  }
  return true;
}

function validaFuncionario() {
  if (!funcionarioId.value) {
    error.value = "Selecione um funcionário.";
    return false;
  }
  return true;
}

function validaEntrega() {
  if (!entrega.value) {
    error.value = "Selecione uma data de entrega.";
    return false;
  }
  return true;
}

function validaProdutos() {
  if (produtosSelecionados.value.length === 0) {
    error.value = "Selecione pelo menos um produto.";
    return false;
  }
  return true;
}

const createFichaProducao = async () => {
  if (
    !validaDescricao() ||
    !validaPedido() ||
    !validaFuncionario() ||
    !validaEntrega() ||
    !validaProdutos()
  ) {
    toast({
      title: "Erro no formulário",
      description: error.value,
      variant: "destructive",
    });
    return;
  }

  try {
    await useFetch("/api/ficha-producao/create", {
      method: "POST",
      body: {
        descricao: descricao.value,
        pedidoId: parseInt(pedidoId.value),
        funcionarioId: parseInt(funcionarioId.value),
        entrega: entrega.value,
        tarefaIds: tarefasSelecionadas.value,
        produtos: produtosSelecionados.value,
      },
    });

    toast({
      title: "Ficha de produção cadastrada!",
      description: "A ficha de produção foi criada com sucesso.",
    });

    emit("fichaProducaoCriada");

    // Limpar formulário
    descricao.value = "";
    pedidoId.value = "";
    funcionarioId.value = "";
    entrega.value = "";
    tarefasSelecionadas.value = [];
    produtosSelecionados.value = [];
    error.value = undefined;
    open.value = false;
  } catch (error) {
    toast({
      title: "Erro ao criar ficha de produção",
      description: error instanceof Error ? error.message : "Erro inesperado.",
      variant: "destructive",
    });
    console.error("Erro ao criar ficha de produção:", error);
  }
};
</script>
