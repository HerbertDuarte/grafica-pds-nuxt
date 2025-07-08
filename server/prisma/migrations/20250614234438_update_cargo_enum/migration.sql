/*
  Warnings:

  - You are about to drop the column `cargoId` on the `Funcionario` table. All the data in the column will be lost.
  - You are about to drop the `Cargo` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cargo` to the `Funcionario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Funcionario" DROP CONSTRAINT "Funcionario_cargoId_fkey";

-- AlterTable
ALTER TABLE "Funcionario" DROP COLUMN "cargoId",
ADD COLUMN     "cargo" TEXT NOT NULL;

-- DropTable
DROP TABLE "Cargo";
