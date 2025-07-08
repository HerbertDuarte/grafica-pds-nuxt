-- CreateTable
CREATE TABLE "FichaProducao" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "materiaPrima" TEXT[],
    "entrega" TIMESTAMP(3) NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "fichaProducaoId" INTEGER NOT NULL,

    CONSTRAINT "FichaProducao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tarefa" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "descriao" TEXT NOT NULL,
    "isObrigatorio" BOOLEAN NOT NULL,
    "isSimultanea" BOOLEAN NOT NULL,

    CONSTRAINT "Tarefa_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FichaProducao" ADD CONSTRAINT "FichaProducao_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FichaProducao" ADD CONSTRAINT "FichaProducao_fichaProducaoId_fkey" FOREIGN KEY ("fichaProducaoId") REFERENCES "Tarefa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
