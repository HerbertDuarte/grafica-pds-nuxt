<script lang="ts" setup>
import type { Funcionario } from "@prisma/client";
import { Pen } from "lucide-vue-next";
import { Button } from "../ui/button";
import { useToast } from "../ui/toast";

const props = defineProps<{
  funcionario: Funcionario;
  // cargos?: { id: number; titulo: string }[] // opcional para dropdown cargo
}>();

const open = ref(false);
const id = ref(props.funcionario.id);
const nome = ref(props.funcionario.nome);
const cpf = ref(props.funcionario.cpf);
const telefone = ref(props.funcionario.telefone);
const email = ref(props.funcionario.email);
const cargo = ref(props.funcionario.cargo);

const { toast } = useToast();
const emit = defineEmits(["funcionarioAtualizado"]);

const updateFuncionario = async () => {
  try {
    const response = await $fetch("/api/funcionarios/update", {
      method: "put",
      body: {
        id: id.value,
        nome: nome.value,
        cpf: cpf.value,
        telefone: telefone.value,
        email: email.value,
        cargo: cargo.value,
      },
    });

    toast({
      title: "Funcionário editado!",
      description: "O funcionário foi editado com sucesso.",
    });

    emit("funcionarioAtualizado");

    open.value = false;
  } catch (error) {
    toast({
      title: "Erro ao editar funcionário",
      description: (error as any).message || "Tente novamente.",
      variant: "destructive",
    });
    console.error("Erro ao editar funcionário:", error);
  }
};
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button
        variant="outline"
        class="transition-transform duration-200 hover:-translate-y-1"
      >
        <Pen />
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Editar Funcionário</DialogTitle>
        <DialogDescription>
          Edite os campos abaixo para editar o funcionário.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="nome" class="text-right"> Nome </Label>
          <Input
            id="nome"
            v-model="nome"
            class="col-span-3"
            placeholder="Digite o nome do funcionário"
            required
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="cpf" class="text-right"> CPF </Label>
          <Input
            id="cpf"
            v-mask="'###.###.###-##'"
            v-model="cpf"
            class="col-span-3"
            placeholder="Digite o CPF"
            required
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="telefone" class="text-right"> Telefone </Label>
          <Input
            v-mask="['(##) ####-####', '(##) #####-####']"
            id="telefone"
            v-model="telefone"
            class="col-span-3"
            placeholder="Digite o telefone"
            required
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="email" class="text-right"> Email </Label>
          <Input
            id="email"
            type="email"
            v-model="email"
            class="col-span-3"
            placeholder="Digite o email"
            required
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="cargo" class="text-right"> Cargo </Label>
          <select
            id="cargo"
            v-model="cargo"
            class="col-span-3 rounded border border-gray-300 p-2"
            required
          >
            <option disabled value="">Selecione o cargo</option>
            <option value="ADMINISTRADOR">ADMINISTRADOR</option>
            <option value="VENDEDOR">VENDEDOR</option>
            <option value="SERRALHEIRO">SERRALHEIRO</option>
            <option value="MONTADOR">MONTADOR</option>
            <option value="ENTREGADOR">ENTREGADOR</option>
          </select>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" @click="updateFuncionario">
          Editar Funcionário
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style scoped></style>
