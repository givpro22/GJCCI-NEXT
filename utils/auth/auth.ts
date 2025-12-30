"use server";

import { createClient } from "@/utils/supabase/server";

export async function requireUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error("로그인 정보를 불러오는데 실패했습니다.");
  }

  if (!user) {
    throw new Error("Not authenticated");
  }

  return { supabase, user };
}
