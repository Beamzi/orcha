import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const result = await request.json();

  const { title, id } = result;

  const prismaRequest = await prisma.chatInstance.update({
    where: { id: id },
    data: { title: title },
  });
  return NextResponse.json(prismaRequest);
}
