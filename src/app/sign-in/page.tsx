import SignInForm from "@/components/SignIn";
import { SignInClient } from "@/components/SignInClient";
import { Sign } from "crypto";
import React from "react";

export default function SignIn() {
  return (
    <div>
      <SignInClient />
      {/* <SignInForm /> */}
    </div>
  );
}
