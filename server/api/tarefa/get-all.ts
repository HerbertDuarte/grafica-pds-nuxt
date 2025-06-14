import prisma from "~/server/prisma/client";
export default defineEventHandler(async () => {
  return await prisma.tarefa.findMany({ orderBy: { id: 'asc' } });
});
