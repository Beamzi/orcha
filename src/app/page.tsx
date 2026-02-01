import TestRenderSearch from "@/components/TestRenderSearch";
import { prisma } from "@/lib/prisma";
import { auth } from "../../auth";
import InstanceView from "@/components/InstanceView";

export default async function Home() {
  // const session = await auth();
  // const posts = await testRead();

  // console.log({ session });

  return (
    <div className="border-">
      <InstanceView />
      {/* <TestRenderSearch /> */}
    </div>
  );
}
