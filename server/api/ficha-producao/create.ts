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

  // Verificar se a tarefa existe
  if (body.tarefaIds && body.tarefaIds.length > 0) {
    const tarefaExistente = await prisma.tarefa.findUnique({
      where: {
        id: body.tarefaIds[0], // Pegar apenas a primeira tarefa
      },
    });

    if (!tarefaExistente) {
      throw createError({
        statusCode: 404,
        statusMessage: "Tarefa não encontrada",
      });
    }
  }

  const fichaProducao = await prisma.fichaProducao.create({
    data: {
      descricao: body.descricao,
      entrega: new Date(body.entrega),
      pedidoId: body.pedidoId,
      funcionarioId: body.funcionarioId,
      tarefaId:
        body.tarefaIds && body.tarefaIds.length > 0
          ? body.tarefaIds[0]
          : undefined,
      createdAt: new Date(),
    },
  });

  // Criar relações com produtos se fornecidas
  if (body.produtos && body.produtos.length > 0) {
    await prisma.fichaProducaoProduto.createMany({
      data: body.produtos.map(
        (produto: { id: number; quantidade: number }) => ({
          fichaProducaoId: fichaProducao.id,
          produtoId: produto.id,
          quantidade: produto.quantidade,
        })
      ),
    });
  }

  return fichaProducao;
});
