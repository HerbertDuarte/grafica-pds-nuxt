import prisma from '~/server/prisma/client';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { id, nome, descricao, preco } = body;

  const produto = await prisma.produto.update({
    where: {
      id: parseInt(id),
    },
    data: {
      nome,
      descricao,
      preco: parseFloat(preco),
    },
  });

  return produto;
})
