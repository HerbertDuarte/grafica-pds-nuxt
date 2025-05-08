import prisma from "~/server/prisma/client";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  if (!body.id) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID é obrigatório"
    });
  }

  try {
    const updatedCliente = await prisma.cliente.update({
      where: { 
        id: Number(body.id) 
      },
      data: {
        nome: body.nome,
        cpf: body.cpf,
        telefone: body.telefone,
        email: body.email,
      },
    });

    return updatedCliente;
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: "Erro ao atualizar cliente"
    });
  }
});