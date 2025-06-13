import prisma from "~/server/prisma/client";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  return await prisma.tarefa.create({
    data: {
      nome: body.nome,
      isObrigatorio: body.obrigatoriedade,
      isSimultanea: body.simultaniedade,
      descricao: body.descricao,
    },
  });
});
