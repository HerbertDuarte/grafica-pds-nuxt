import prisma from "~/server/prisma/client";

export default defineEventHandler(async () => {
  const fichasProducao = await prisma.fichaProducao.findMany({
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
    orderBy: {
      id: "asc",
    },
  });

  return fichasProducao;
});
