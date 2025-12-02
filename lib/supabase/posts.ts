import { createClientSideSupabaseClient } from "@/utils/supabase/client";
import { CategoryId } from "../definitions";

const supabase = createClientSideSupabaseClient();

type CreatePost = {
  author: string;
  category: CategoryId;
  title: string;
  content: string;
  likes: number;
  comments: number;
};

export async function fetchPosts(category?: string) {
  let query = supabase.from("posts").select("*");

  if (category && category !== "all") query = query.eq("category", category);

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createPost(newPost: CreatePost) {
  const { data, error } = await supabase
    .from("posts")
    .insert({
      author: newPost.author,
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
