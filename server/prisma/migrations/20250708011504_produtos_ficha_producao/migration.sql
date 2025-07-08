/*
  Warnings:

  - You are about to drop the column `materiaPrima` on the `FichaProducao` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FichaProducao" DROP COLUMN "materiaPrima";

-- CreateTable
CREATE TABLE "FichaProducaoProduto" (
    "id" SERIAL NOT NULL,
    "fichaProducaoId" INTEGER NOT NULL,
    "produtoId" INTEGER NOT NULL,

    CONSTRAINT "FichaProducaoProduto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FichaProducaoProduto_fichaProducaoId_produtoId_key" ON "FichaProducaoProduto"("fichaProducaoId", "produtoId");

-- AddForeignKey
ALTER TABLE "FichaProducaoProduto" ADD CONSTRAINT "FichaProducaoProduto_fichaProducaoId_fkey" FOREIGN KEY ("fichaProducaoId") REFERENCES "FichaProducao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FichaProducaoProduto" ADD CONSTRAINT "FichaProducaoProduto_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
