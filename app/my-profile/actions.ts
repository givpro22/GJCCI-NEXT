"use server";

import { createClient } from "@/utils/supabase/server";

export async function getMyProfile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  return {
    user,
    role: profile?.role ?? "user",
  };
}

export async function updateMyProfile({ name }: { name: string }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  await supabase.auth.updateUser({
    data: { name },
  });
}
