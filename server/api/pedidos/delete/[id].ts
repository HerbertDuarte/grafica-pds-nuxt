import prisma from "~/server/prisma/client";

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID inválido.",
    });
  }

  const pedidoExists = await prisma.pedido.findUnique({
    where: { id },
  });

  if (!pedidoExists) {
    throw createError({
      statusCode: 404,
      statusMessage: "Pedido não encontrado.",
    });
  }

  // Verificar se existem fichas de produção associadas
  const fichasProducao = await prisma.fichaProducao.findMany({
    where: { pedidoId: id },
  });

  if (fichasProducao.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage:
        "Não é possível deletar o pedido pois existem fichas de produção associadas.",
    });
  }

  // Verificar se existem produtos associados
  const pedidoProdutos = await prisma.pedidoProduto.findMany({
    where: { pedidoId: id },
  });

  if (pedidoProdutos.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage:
        "Não é possível deletar o pedido pois existem produtos associados.",
    });
  }

  await prisma.pedido.delete({
    where: { id },
  });

  return { message: "Pedido deletado com sucesso!" };
});
