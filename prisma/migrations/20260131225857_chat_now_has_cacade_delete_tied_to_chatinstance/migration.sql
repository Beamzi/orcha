-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_instanceId_fkey";

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_instanceId_fkey" FOREIGN KEY ("instanceId") REFERENCES "ChatInstance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
