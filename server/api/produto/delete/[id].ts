import prisma from '~/server/prisma/client';

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'));

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID inválido.',
    });
  }

  const produto = await prisma.produto.delete({
    where: { id },
  });

  return { message: 'Produto deletado com sucesso!' }
})
