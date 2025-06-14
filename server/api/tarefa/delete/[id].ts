import prisma from "~/server/prisma/client";

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID inválido.",
    });
  }

  const tarefaExists = await prisma.tarefa.findUnique({
    where: { id },
  });

  if (!tarefaExists) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID inválido.",
    });
  }

  await prisma.tarefa.delete({
    where: { id },
  });

  return { message: "Tarefa deletada com sucesso!" };
});