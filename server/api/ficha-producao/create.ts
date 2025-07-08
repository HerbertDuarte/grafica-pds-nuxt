import prisma from "~/server/prisma/client";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Verificar se o pedido existe
  const pedidoExistente = await prisma.pedido.findUnique({
    where: {
      id: body.pedidoId,
    },
  });

  if (!pedidoExistente) {
    throw createError({
      statusCode: 404,
      statusMessage: "Pedido não encontrado",
    });
  }

  // Verificar se o funcionário existe
  const funcionarioExistente = await prisma.funcionario.findUnique({
    where: {
      id: body.funcionarioId,
    },
  });

  if (!funcionarioExistente) {
    throw createError({
      statusCode: 404,
      statusMessage: "Funcionário não encontrado",
    });
  }

  const fichaProducao = await prisma.fichaProducao.create({
    data: {
      descricao: body.descricao,
      entrega: new Date(body.entrega),
      pedidoId: body.pedidoId,
      funcionarioId: body.funcionarioId,
      createdAt: new Date(),
    },
  });

  // Criar relações com tarefas se fornecidas
  if (body.tarefaIds && body.tarefaIds.length > 0) {
    await prisma.fichaProducaoTarefa.createMany({
      data: body.tarefaIds.map((tarefaId: number) => ({
        fichaProducaoId: fichaProducao.id,
        tarefaId: tarefaId,
      })),
    });
  }

  // Criar relações com produtos se fornecidas
  if (body.produtos && body.produtos.length > 0) {
    await prisma.fichaProducaoProduto.createMany({
      data: body.produtos.map((produto: { id: number; quantidade: number }) => ({
        fichaProducaoId: fichaProducao.id,
        produtoId: produto.id,
        quantidade: produto.quantidade,
      })),
    });
  }

  return fichaProducao;
});
