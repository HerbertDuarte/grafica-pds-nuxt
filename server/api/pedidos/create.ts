import prisma from "~/server/prisma/client";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Verificar se o cliente existe
  const clienteExists = await prisma.cliente.findUnique({
    where: {
      id: Number(body.clienteId),
    },
  });

  if (!clienteExists) {
    throw createError({
      statusCode: 400,
      statusMessage: "Cliente não encontrado",
    });
  }

  const pedido = await prisma.pedido.create({
    data: {
      descricao: body.descricao,
      previsao_entrega: new Date(body.previsao_entrega),
      preco_total: Number(body.preco_total),
      desconto: Number(body.desconto) || 0,
      clienteId: Number(body.clienteId),
      createdAt: new Date(),
    },
    include: {
      cliente: true,
    },
  });

  return pedido;
});
