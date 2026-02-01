import { prisma } from "../prisma";

async function getChats(instanceId: number) {
  const request = await prisma.chat.findMany({
    where: { instanceId: instanceId },
  });
}
