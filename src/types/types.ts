import { Database } from "./supabase";

export type UserType = Database["public"]["Tables"]["users"]["Row"];

export type PostType = Database["public"]["Tables"]["posts"]["Row"];

type UserIDType = {
  user_id: UserType;
};

export type PostUserType = PostType & UserIDType;
