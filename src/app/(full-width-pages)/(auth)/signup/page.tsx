import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar | Laptopku",
  description: "Buat akun untuk mengelola SPK Laptopku",
};

export default function SignUp() {
  return <SignUpForm />;
}
