import prisma from "~/server/prisma/client";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const cliente = await prisma.cliente.create({
    data: {
      nome: body.nome,
      cpf: body.cpf,
      telefone: body.telefone,
      email: body.email,
      createdAt: new Date(),
    },
  });

  return cliente;
});