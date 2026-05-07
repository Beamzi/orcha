import Dashboard from "@/components/dashboard/Dashboard";
import InstanceView from "@/components/InstanceView";
import { auth } from "../../../auth";
import { SignInClient } from "@/components/SignInClient";

export default async function page() {
  const session = await auth();
  return (
    <Dashboard>{!session ? <SignInClient /> : <InstanceView />}</Dashboard>
  );
}
