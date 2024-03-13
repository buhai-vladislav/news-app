/*
  Warnings:

  - You are about to drop the column `deleteAt` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "deleteAt",
ADD COLUMN     "deletedAt" TIMESTAMP(3);
