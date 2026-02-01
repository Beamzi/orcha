import { prisma } from "@/lib/prisma";
import { auth } from "../../../../auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let chat = await request.json();

  const { response, prompt, instanceId } = chat;

  const prismaResponse = await prisma.chat.create({
    data: {
      response: response,
      prompt: prompt,
      instanceId: instanceId,
    },
  });

  return NextResponse.json({ prismaResponse });
}
