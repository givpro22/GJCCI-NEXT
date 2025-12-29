"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function approveUser(userId: string) {
  try {
    const session = await auth();
    if (session?.user.role !== "admin") {
      throw new Error("관리자 권한이 없습니다.");
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from("users")
      .update({ status: "approved" })
      .eq("id", userId);

    if (error) throw error;

    revalidatePath("/admin");
  } catch (error) {
    console.error("approveUser Error:", error);
  }
}

export async function rejectUser(userId: string) {
  try {
    const session = await auth();
    if (session?.user.role !== "admin") {
      throw new Error("관리자 권한이 없습니다.");
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from("users")
      .update({ status: "rejected" })
      .eq("id", userId);

    if (error) throw error;

    revalidatePath("/admin");
  } catch (error) {
    console.error("rejectUser Error:", error);
  }
}

export async function updateUserRole(
  userId: string,
  role: "admin" | "main_director" | "sub_director"
) {
  try {
    const session = await auth();
    if (session?.user.role !== "admin") {
      throw new Error("관리자 권한이 없습니다.");
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from("users")
      .update({ role })
      .eq("id", userId);

    if (error) throw error;

    revalidatePath("/admin");
  } catch (error) {
    console.error("updateUserRole Error:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteUser(userId: string) {
  try {
    const session = await auth();
    if (session?.user.role !== "admin") {
      throw new Error("관리자 권한이 없습니다.");
    }

    const supabase = await createClient();

    const { error } = await supabase.from("users").delete().eq("id", userId);

    if (error) throw error;

    revalidatePath("/admin");
  } catch (error) {
    console.error("deleteUser Error:", error);
  }
}
