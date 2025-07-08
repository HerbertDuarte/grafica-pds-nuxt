import prisma from "~/server/prisma/client";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Verificar se a ficha de produção existe
  const fichaExistente = await prisma.fichaProducao.findUnique({
    where: {
      id: body.id,
    },
  });

  if (!fichaExistente) {
    throw createError({
      statusCode: 404,
      statusMessage: "Ficha de produção não encontrada",
    });
  }

  // Verificar se o pedido existe (se foi alterado)
  if (body.pedidoId) {
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
  }

  // Verificar se o funcionário existe (se foi alterado)
  if (body.funcionarioId) {
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
  }

  const fichaProducao = await prisma.fichaProducao.update({
    where: {
      id: body.id,
    },
    data: {
      descricao: body.descricao,
      entrega: body.entrega ? new Date(body.entrega) : undefined,
      pedidoId: body.pedidoId,
      funcionarioId: body.funcionarioId,
    },
  });

  // Atualizar tarefas se fornecidas
  if (body.tarefaIds !== undefined) {
    // Remover tarefas existentes
    await prisma.fichaProducaoTarefa.deleteMany({
      where: {
        fichaProducaoId: body.id,
      },
    });

    // Adicionar novas tarefas
    if (body.tarefaIds.length > 0) {
      await prisma.fichaProducaoTarefa.createMany({
        data: body.tarefaIds.map((tarefaId: number) => ({
          fichaProducaoId: body.id,
          tarefaId: tarefaId,
        })),
      });
    }
  }

  // Atualizar produtos se fornecidas
  if (body.produtos !== undefined) {
    // Remover produtos existentes
    await prisma.fichaProducaoProduto.deleteMany({
      where: {
        fichaProducaoId: body.id,
      },
    });

    // Adicionar novos produtos
    if (body.produtos.length > 0) {
      await prisma.fichaProducaoProduto.createMany({
        data: body.produtos.map((produto: { id: number; quantidade: number }) => ({
          fichaProducaoId: body.id,
          produtoId: produto.id,
          quantidade: produto.quantidade,
        })),
      });
    }
  }

  return fichaProducao;
});
