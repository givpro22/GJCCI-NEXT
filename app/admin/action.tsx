"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function approveUser(userId: string) {
  const supabase = await createClient();

  await supabase.from("users").update({ status: "approved" }).eq("id", userId);
  revalidatePath("/admin");
}

export async function rejectUser(userId: string) {
  const supabase = await createClient();

  await supabase.from("users").update({ status: "rejected" }).eq("id", userId);
  revalidatePath("/admin");
}

export async function updateUserRole(
  userId: string,
  role: "admin" | "main_director" | "sub_director"
) {
  const supabase = await createClient();

  await supabase.from("users").update({ role }).eq("id", userId);
  revalidatePath("/admin");
}

export async function deleteUser(userId: string) {
  const supabase = await createClient();

  await supabase.from("users").delete().eq("id", userId);
  revalidatePath("/admin");
}
