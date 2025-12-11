import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const result = await request.json();

  const { title, chatlogs } = result;

  const prismaRequest = await prisma.chatInstance.create({
    data: {
      title: title,
      chatlogs: chatlogs,
      authorId: 1,
    },
  });

  return NextResponse.json(prismaRequest);
}
