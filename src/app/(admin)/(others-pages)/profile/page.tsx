import UserAddressCard from "@/components/user-profile/UserAddressCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Profile | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Profile page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

import { cookies } from "next/headers";
import { getSupabaseAdminClient } from "@/lib/databaseServer";

export default async function Profile() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  
  let profileData = null;
  if (userId) {
    const supabase = getSupabaseAdminClient();
    const { data } = await supabase.from("profiles").select("*").eq("user_id", userId).single();
    profileData = data;
  }

  // Fallback defaults if no profile exists
  profileData = profileData || {
    first_name: "Nama",
    last_name: "Tidak Tersedia",
    email: "tidak@tersedia.com",
    phone: "-",
    bio: "-",
    job_title: "User",
    location: "-",
    country: "-",
    city_state: "-",
    postal_code: "-",
    tax_id: "-",
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
  };

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard profile={profileData} />
          <UserInfoCard profile={profileData} />
          <UserAddressCard profile={profileData} />
        </div>
      </div>
    </div>
  );
}
