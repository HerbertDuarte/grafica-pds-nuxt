import prisma from "~/server/prisma/client";

export default defineEventHandler(async () => {
  const clientes = await prisma.cliente.findMany({
    orderBy: {
      id: "asc",
    },
  });

  return clientes;
});