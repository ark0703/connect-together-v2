import supabase from "./supabase";

export async function fetchPostsWithUsers(offset: number, LIMIT: number) {
  const { data, error } = await supabase
    .from("posts")
    .select("*, user_id(*), comments(count), likes(count)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
}
