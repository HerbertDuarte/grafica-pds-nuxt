import prisma from "~/server/prisma/client";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Verificar se já existe um cliente com este email
  const existingCliente = await prisma.cliente.findUnique({
    where: {
      email: body.email
    }
  });

  if (existingCliente) {
    throw createError({
      statusCode: 400,
      statusMessage: "Já existe um cliente cadastrado com este email"
    });
  }

  const cliente = await prisma.cliente.create({
    data: {
      nome: body.nome,
      endereco: body.endereco,
      cpf: body.cpf,
      telefone: body.telefone,
      email: body.email,
      createdAt: new Date(),
    },
  });

  return cliente;
});