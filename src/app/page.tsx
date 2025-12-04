import TestRenderSearch from "@/components/TestRenderSearch";
import { prisma } from "@/lib/prisma";

async function testRead() {
  const request = await prisma.post.findMany({
    where: { published: true },
  });
  return request;
}

export default async function Home() {
  const posts = await testRead();

  return (
    <div>
      {posts.map((item) => (
        <p key={item.id}>{item.content}</p>
      ))}
      <TestRenderSearch />
    </div>
  );
}
