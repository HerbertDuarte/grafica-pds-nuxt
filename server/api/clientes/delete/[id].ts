import prisma from "~/server/prisma/client";

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID inválido.",
    });
  }

  const clienteExists = await prisma.cliente.findUnique({
    where: { id },
  });

  if (!clienteExists) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID inválido.",
    });
  }

  await prisma.cliente.delete({
    where: { id },
  });

  return { message: "Cliente deletado com sucesso!" };
});
