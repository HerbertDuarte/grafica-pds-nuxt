/*
 Warnings:
 
 - You are about to drop the `FichaProducaoTarefa` table. If the table is not empty, all the data it contains will be lost.
 - Added the required column `tarefaId` to the `FichaProducao` table without a default value. This is not possible if the table is not empty.
 
 */
-- First, add the tarefaId column as nullable
ALTER TABLE
  "FichaProducao"
ADD
  COLUMN "tarefaId" INTEGER;

-- Migrate data from FichaProducaoTarefa to FichaProducao
-- For each FichaProducao, set tarefaId to the first (or only) tarefa associated with it
UPDATE
  "FichaProducao"
SET
  "tarefaId" = (
    SELECT
      "tarefaId"
    FROM
      "FichaProducaoTarefa"
    WHERE
      "FichaProducaoTarefa"."fichaProducaoId" = "FichaProducao"."id"
    LIMIT
      1
  );

-- Make tarefaId NOT NULL after data migration
ALTER TABLE
  "FichaProducao"
ALTER COLUMN
  "tarefaId"
SET
  NOT NULL;

-- DropForeignKey
ALTER TABLE
  "FichaProducaoTarefa" DROP CONSTRAINT "FichaProducaoTarefa_fichaProducaoId_fkey";

-- DropForeignKey
ALTER TABLE
  "FichaProducaoTarefa" DROP CONSTRAINT "FichaProducaoTarefa_tarefaId_fkey";

-- DropTable
DROP TABLE "FichaProducaoTarefa";

-- AddForeignKey
ALTER TABLE
  "FichaProducao"
ADD
  CONSTRAINT "FichaProducao_tarefaId_fkey" FOREIGN KEY ("tarefaId") REFERENCES "Tarefa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;