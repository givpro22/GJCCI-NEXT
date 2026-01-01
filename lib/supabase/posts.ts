import { createClientSideSupabaseClient } from "@/utils/supabase/client";
import { CategoryId } from "../definitions";

const supabase = createClientSideSupabaseClient();

export type CreatePost = {
  author_id: string;
  author_name: string | undefined;
  category: CategoryId;
  title: string;
  content: string;
  likes: number;
  comments: number;
};

export async function fetchPosts({
  page,
  pageSize,
  category,
}: {
  page: number;
  pageSize: number;
  category?: CategoryId | "all";
}) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("posts")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  const { data, count, error } = await query;

  if (error) throw error;

  return {
    posts: data ?? [],
    totalCount: count ?? 0,
  };
}

export async function createPost(newPost: CreatePost) {
  const { data, error } = await supabase
    .from("posts")
    .insert({
      author_id: newPost.author_id,
      author_name: newPost.author_name,
      category: newPost.category,
      title: newPost.title,
      content: newPost.content,
      likes: newPost.likes,
      comments: newPost.comments,
    })
    .select();

  if (error) throw error;
  return data;
}

export async function deletePost(postId: number) {
  const { error } = await supabase.from("posts").delete().eq("id", postId);

  if (error) throw error;
}
