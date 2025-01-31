import { useEffect, useState } from "react";
import { CommentUserType } from "../types/types";
import supabase from "../utils/supabase";
import { Box, Typography } from "@mui/material";
import moment from "moment";
import AddComment from "./AddComment";

export default function ViewComments({ postId }: { postId: number }) {
  const [comments, setComments] = useState<CommentUserType[]>([]);

  useEffect(() => {
    // Fetch comments from database
    supabase
      .from("comments")
      .select("*, user_id(*)")
      .eq("post_id", postId)
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
          return;
        }
        setComments(data);
      });
  }, []);

  return (
    <Box>
      {comments.map((comment) => (
        <Box key={comment.id}>
          <Typography>{comment.comment}</Typography>
          <Typography>
            {moment(comment.created_at).fromNow()} by {comment.user_id.username}
          </Typography>
        </Box>
      ))}
      <AddComment postId={postId} />
    </Box>
  );
}
