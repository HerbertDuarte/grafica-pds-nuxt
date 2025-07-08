import prisma from "~/server/prisma/client";

export default defineEventHandler(async (event) => {
  const id =
    event.context.params?.id ??
    (() => {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid request: Missing ID",
      });
    })();

  const pedido = await prisma.pedido.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      cliente: true,
      pedidoProduto: {
        include: {
          produto: true,
        },
      },
    },
  });

  if (!pedido) {
    throw createError({ statusCode: 404, statusMessage: "Pedido not found" });
  }

  return pedido;
});
