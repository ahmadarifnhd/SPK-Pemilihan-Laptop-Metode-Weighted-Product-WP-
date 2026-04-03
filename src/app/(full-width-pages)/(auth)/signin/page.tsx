import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk | Laptopku Admin",
  description: "Login panel admin SPK Laptopku — laptop bekas dengan metode WP",
};

import { cookies } from "next/headers";

export default function SignIn() {
  return <SignInForm />;
}
