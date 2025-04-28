import { readBody } from 'h3'; // Função para ler o corpo da requisição
import prisma from '~/server/prisma/client';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { nome, descricao, preco } = body;

  const produto = await prisma.produto.create({
    data: {
      nome,
      descricao,
      preco: parseFloat(preco),
    },
  });

  return produto;
});
