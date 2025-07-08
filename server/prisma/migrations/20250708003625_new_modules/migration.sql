/*
  Warnings:

  - You are about to drop the column `fichaProducaoId` on the `FichaProducao` table. All the data in the column will be lost.
  - Added the required column `funcionarioId` to the `FichaProducao` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FichaProducao" DROP CONSTRAINT "FichaProducao_fichaProducaoId_fkey";

-- AlterTable
ALTER TABLE "FichaProducao" DROP COLUMN "fichaProducaoId",
ADD COLUMN     "funcionarioId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "FichaProducaoTarefa" (
    "id" SERIAL NOT NULL,
    "fichaProducaoId" INTEGER NOT NULL,
    "tarefaId" INTEGER NOT NULL,

    CONSTRAINT "FichaProducaoTarefa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FichaProducaoTarefa_fichaProducaoId_tarefaId_key" ON "FichaProducaoTarefa"("fichaProducaoId", "tarefaId");

-- AddForeignKey
ALTER TABLE "FichaProducao" ADD CONSTRAINT "FichaProducao_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "Funcionario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FichaProducaoTarefa" ADD CONSTRAINT "FichaProducaoTarefa_fichaProducaoId_fkey" FOREIGN KEY ("fichaProducaoId") REFERENCES "FichaProducao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FichaProducaoTarefa" ADD CONSTRAINT "FichaProducaoTarefa_tarefaId_fkey" FOREIGN KEY ("tarefaId") REFERENCES "Tarefa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
