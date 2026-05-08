import Dashboard from "@/components/dashboard/Dashboard";
import InstanceView from "@/components/InstanceView";
import { auth } from "../../../auth";
import { SignInClient } from "@/components/SignInClient";

export default async function DashboardPage() {
  const session = await auth();
  return (
    <>
      {!session ? (
        <SignInClient />
      ) : (
        <Dashboard>
          <InstanceView />
        </Dashboard>
      )}
    </>
  );
}
