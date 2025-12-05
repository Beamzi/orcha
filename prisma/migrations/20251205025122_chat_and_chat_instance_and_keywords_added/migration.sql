/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "keywords" TEXT;

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "ChatInstance" (
    "id" SERIAL NOT NULL,
    "keywords" TEXT,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "ChatInstance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" SERIAL NOT NULL,
    "model" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "instanceId" INTEGER NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChatInstance" ADD CONSTRAINT "ChatInstance_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_instanceId_fkey" FOREIGN KEY ("instanceId") REFERENCES "ChatInstance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
