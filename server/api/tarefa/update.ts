import prisma from "~/server/prisma/client";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  return await prisma.tarefa.update({
    where: { id: body.id },
    data: {
      nome: body.nome,
      isObrigatorio: body.isObrigatorio,
      isSimultanea: body.isSimultanea,
      descricao: body.descricao,
    },
  });
});
