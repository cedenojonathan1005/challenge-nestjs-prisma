/*
  Warnings:

  - Added the required column `description` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "TaskStatusEnum" ADD VALUE 'EXPIRED';

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "description" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'TODO';
