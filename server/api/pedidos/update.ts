import prisma from "~/server/prisma/client";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.id) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID é obrigatório",
    });
  }

  // Verificar se o pedido existe
  const pedidoExists = await prisma.pedido.findUnique({
    where: { id: Number(body.id) },
  });

  if (!pedidoExists) {
    throw createError({
      statusCode: 404,
      statusMessage: "Pedido não encontrado",
    });
  }

  // Verificar se o cliente existe (se foi informado)
  if (body.clienteId) {
    const clienteExists = await prisma.cliente.findUnique({
      where: { id: Number(body.clienteId) },
    });

    if (!clienteExists) {
      throw createError({
        statusCode: 400,
        statusMessage: "Cliente não encontrado",
      });
    }
  }

  try {
    const updatedPedido = await prisma.pedido.update({
      where: {
        id: Number(body.id),
      },
      data: {
        descricao: body.descricao,
        previsao_entrega: body.previsao_entrega
          ? new Date(body.previsao_entrega)
          : undefined,
        preco_total: body.preco_total ? Number(body.preco_total) : undefined,
        desconto:
          body.desconto !== undefined ? Number(body.desconto) : undefined,
        clienteId: body.clienteId ? Number(body.clienteId) : undefined,
      },
      include: {
        cliente: true,
      },
    });

    return updatedPedido;
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: "Erro ao atualizar pedido",
    });
  }
});
