import prisma from "~/server/prisma/client";
export default defineEventHandler(async () => {
  return await prisma.funcionario.findMany({ orderBy: { id: 'asc' } });
});
