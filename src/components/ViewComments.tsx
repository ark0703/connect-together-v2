import { useEffect, useState } from "react";
import { PostCommentUserType } from "../types/types";
import supabase from "../utils/supabase";
import { Box, Typography } from "@mui/material";
import moment from "moment";
import AddComment from "./AddComment";

export default function ViewComments({
  postId,
  onCommentAdded,
}: {
  postId: number;
  onCommentAdded: () => void;
}) {
  const [comments, setComments] = useState<PostCommentUserType[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*, user_id(*)")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error(error);
        return;
      }

      setComments(data);
    };

    fetchComments();
  }, [postId]);

  const handleCommentAdded = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("*, user_id(*)")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    setComments(data);
    onCommentAdded();
  };

  return (
    <Box p={2}>
      {comments.length > 0 ? (
        <Box
          sx={{
            maxHeight: comments.length > 3 ? 200 : "auto", // Scroll only if more than 3 comments
            overflowY: comments.length > 3 ? "auto" : "visible",
            border: comments.length > 3 ? "1px solid #ddd" : "none",
            borderRadius: 1,
            p: 1,
          }}
        >
          {comments.map((comment) => (
            <Box
              key={comment.id}
              sx={{ mb: 1, p: 1, borderBottom: "1px solid #ddd" }}
            >
              <Typography variant="body2">{comment.comment}</Typography>
              <Typography variant="caption" color="text.secondary">
                {moment(comment.created_at).fromNow()} by{" "}
                {comment.user_id.username}
              </Typography>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No comments yet. Be the first to comment!
        </Typography>
      )}

      {/* Add Comment Section */}
      <AddComment postId={postId} onCommentAdded={handleCommentAdded} />
    </Box>
  );
}
