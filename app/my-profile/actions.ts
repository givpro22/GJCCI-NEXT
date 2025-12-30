"use server";

import { requireUser } from "@/utils/auth/auth";

export async function getMyProfile() {
  const { supabase, user } = await requireUser();

  const { data: profile, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("프로필 조회 실패:", error);
    throw new Error("프로필을 불러오는 데 실패했습니다.");
  }

  return {
    user,
    role: profile?.role ?? "user",
  };
}
export async function updateMyProfile({ name }: { name: string }) {
  const { supabase } = await requireUser();

  await supabase.auth.updateUser({
    data: { name },
  });
}
