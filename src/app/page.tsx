import TestRenderSearch from "@/components/TestRenderSearch";
import { prisma } from "@/lib/prisma";

// async function getChat () {
//   const request = await prisma.chatInstance.findUnique({
//     where: {  }
//   })
// }

export default async function Home() {
  // const posts = await testRead();

  return (
    <div>
      <TestRenderSearch />
    </div>
  );
}
