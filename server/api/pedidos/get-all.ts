import prisma from "~/server/prisma/client";

export default defineEventHandler(async () => {
  const pedidos = await prisma.pedido.findMany({
    include: {
      cliente: true,
      pedidoProduto: {
        include: {
          produto: true,
        },
      },
    },
    orderBy: {
      id: "asc",
    },
  });

  return pedidos;
});
