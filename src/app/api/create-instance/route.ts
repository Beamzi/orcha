// Scalar fields (string, number, etc.) → assign directly
// Relations in write operations → use create, connect, etc.
// Relations in read operations → use include or select

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "../../../../auth";

export async function POST(request: Request) {
  const result = await request.json();
  const session = await auth();

  const {
    title,
    chatlogs: { response, prompt },
  } = result;

  const userId = Number(session?.user?.id);

  const prismaResponse = await prisma.chatInstance.create({
    data: {
      title: title,
      authorId: userId,
      chatlogs: {
        create: {
          response: response,
          prompt: prompt,
        },
      },
    },
    include: {
      chatlogs: true,
    },
  });

  return NextResponse.json({ prismaResponse });
}
