import { prisma } from "../prisma";

export async function getChatInstances() {
  const request = await prisma.chatInstance.findMany({
    include: {
      chatlogs: true,
      author: { select: { id: true } },
    },
  });
  return request;
}
