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

  // Verificar se a tarefa existe (se foi alterada)
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

  const fichaProducao = await prisma.fichaProducao.update({
    where: {
      id: body.id,
    },
    data: {
      descricao: body.descricao,
      entrega: body.entrega ? new Date(body.entrega) : undefined,
      pedidoId: body.pedidoId,
      funcionarioId: body.funcionarioId,
      tarefaId:
        body.tarefaIds && body.tarefaIds.length > 0
          ? body.tarefaIds[0]
          : undefined,
    },
  });

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
        data: body.produtos.map(
          (produto: { id: number; quantidade: number }) => ({
            fichaProducaoId: body.id,
            produtoId: produto.id,
            quantidade: produto.quantidade,
          })
        ),
      });
    }
  }

  return fichaProducao;
});
