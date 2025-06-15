import prisma from "~/server/prisma/client";

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID inválido.",
    });
  }

  const funcionarioExists = await prisma.funcionario.findUnique({
    where: { id },
  });

  if (!funcionarioExists) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID inválido.",
    });
  }

  await prisma.funcionario.delete({
    where: { id },
  });

  return { message: "Funcionario deletado com sucesso!" };
});