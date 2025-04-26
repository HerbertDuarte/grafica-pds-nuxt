import prisma from "~/server/prisma/client";

export default defineEventHandler(async () => {
  const produtos = await prisma.produto.findMany({
    orderBy: {
      id: "asc",
    },
  });

  await new Promise((resolve) => setTimeout(resolve, 5000));

  return produtos;
});
