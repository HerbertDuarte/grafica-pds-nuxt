import prisma from "~/server/prisma/client";

export default defineEventHandler(async () => {
  const produtos = await prisma.produto.findMany({
    orderBy: {
      id: "asc",
    },
  });

  return produtos;
});
