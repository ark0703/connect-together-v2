import { Database } from "./supabase";

export type MessageType = Database["public"]["Tables"]["message"]["Row"];

export type UserType = Database["public"]["Tables"]["users"]["Row"];

export type PostType = Database["public"]["Tables"]["posts"]["Row"];

export type CommentType = Database["public"]["Tables"]["comments"]["Row"];

export type LikeType = Database["public"]["Tables"]["likes"]["Row"];

type UserIDType = {
  user_id: UserType;
};

type LikeUserType = LikeType & UserIDType;

type CommentUserType = CommentType & UserIDType;

type PostLikesType = {
  likes: LikeUserType[];
};

export type PostCommentLikesType = {
  comments: CommentUserType[];
};

export type PostUserType = PostType & UserIDType;

export type PostLikeUserType = PostUserType &
  PostLikesType &
  PostCommentLikesType;

export type PostCommentUserType = CommentType & UserIDType;

export type MessageUserType = MessageType & UserIDType;
