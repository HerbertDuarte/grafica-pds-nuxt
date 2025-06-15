import prisma from "~/server/prisma/client";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  return await prisma.funcionario.update({
    where: { id: body.id },
    data: {
      nome: body.nome,
      cpf: body.cpf,
      telefone: body.telefone,
      email: body.email,
      senha: body.senha,
      cargo: body.cargo,
    },
  });
});
