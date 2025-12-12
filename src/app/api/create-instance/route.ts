import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "../../../../auth";

export async function POST(request: Request) {
  const result = await request.json();
  const session = await auth();

  const { title } = result;

  const userId = Number(session?.user?.id);

  const prismaResponse = await prisma.chatInstance.create({
    data: {
      title: title,
      authorId: userId,
    },
  });

  return NextResponse.json({ prismaResponse });
}
