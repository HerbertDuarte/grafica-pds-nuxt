import prisma from "~/server/prisma/client";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id ?? (() => { throw createError({ statusCode: 400, statusMessage: "Invalid request: Missing ID" }); })();

  const cliente = await prisma.cliente.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!cliente) {
    throw createError({ statusCode: 404, statusMessage: "Cliente not found" });
  }

  return cliente;
});