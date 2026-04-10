import TestRenderSearch from "@/components/CoreRequestChain";
import { prisma } from "@/lib/prisma";
import { auth } from "../../auth";
import InstanceView from "@/components/InstanceView";

const session = await auth();
// console.log(session);
export default async function Home() {
  return (
    <div className="">
      <InstanceView />
    </div>
  );
}
