"use server";

import { getSupabaseAdminClient } from "@/lib/databaseServer";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const keepLoggedIn = formData.get("keepLoggedIn") === "on";

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const supabase = getSupabaseAdminClient();

  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .limit(1);

  if (error) {
    console.error("Login error:", error);
    return { error: "Terjadi kesalahan sistem saat login" };
  }

  if (!users || users.length === 0) {
    return { error: "Email tidak ditemukan" };
  }

  const user = users[0];

  if (user.password !== password) {
    return { error: "Password salah" };
  }

  // Jika login berhasil
  const cookieStore = await cookies();
  cookieStore.set("auth_session", user.id.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: keepLoggedIn ? 60 * 60 * 24 * 30 : 60 * 60 * 8, // 30 hari jika keepLoggedIn, 8 jam default
  });

  return { success: true, redirect: "/admin/dashboard" };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_session");
  redirect("/signin");
}
