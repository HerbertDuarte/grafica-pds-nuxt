import prisma from "~/server/prisma/client";

export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, "id")!);

  const fichaProducao = await prisma.fichaProducao.findUnique({
    where: {
      id: id,
    },
    include: {
      pedido: {
        include: {
          cliente: true,
        },
      },
      funcionario: true,
      tarefas: {
        include: {
          tarefa: true,
        },
      },
      produtos: {
        include: {
          produto: true,
        },
      },
    },
  });

  if (!fichaProducao) {
    throw createError({
      statusCode: 404,
      statusMessage: "Ficha de produção não encontrada",
    });
  }

  return fichaProducao;
});
