import prisma from "~/server/prisma/client";

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID inválido.",
    });
  }

  const fichaExists = await prisma.fichaProducao.findUnique({
    where: { id },
  });

  if (!fichaExists) {
    throw createError({
      statusCode: 400,
      statusMessage: "Ficha de produção não encontrada.",
    });
  }

  // Deletar as relações com tarefas primeiro
  await prisma.fichaProducaoTarefa.deleteMany({
    where: { fichaProducaoId: id },
  });

  // Deletar a ficha de produção
  await prisma.fichaProducao.delete({
    where: { id },
  });

  return { message: "Ficha de produção deletada com sucesso!" };
});
