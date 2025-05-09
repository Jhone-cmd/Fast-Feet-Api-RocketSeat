/*
  Warnings:

  - You are about to drop the column `role` on the `accounts` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Rule" AS ENUM ('admin', 'deliveryman');

-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "role",
ADD COLUMN     "rule" "Rule" NOT NULL DEFAULT 'deliveryman';

-- DropEnum
DROP TYPE "Role";
