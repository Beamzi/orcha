import TestRenderSearch from "@/components/TestRenderSearch";
import { prisma } from "@/lib/prisma";
import { auth } from "../../auth";

export default async function Home() {
  const session = await auth();
  // const posts = await testRead();
  console.log(session);

  return (
    <div>
      <TestRenderSearch />
    </div>
  );
}
