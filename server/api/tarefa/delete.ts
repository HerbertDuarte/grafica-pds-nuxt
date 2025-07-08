import prisma from "~/server/prisma/client";

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'));
  return await prisma.tarefa.delete({ where: { id } });
});
