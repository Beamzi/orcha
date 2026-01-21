import { prisma } from "@/lib/prisma";
import { auth } from "../../../../auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();
  const result = await request.json();
  const { instanceId } = result;
  if (session) {
    const request = await prisma.chatInstance.delete({
      where: { id: instanceId },
    });
    return NextResponse.json({ request });
  } else throw new Error("unauthorised query");
}
