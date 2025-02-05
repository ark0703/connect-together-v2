import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import supabase from "../utils/supabase";
import { useAuth } from "../contexts/AuthContext";

export default function AddComment({
  postId,
  onCommentAdded,
}: {
  postId: number;
  onCommentAdded: () => void;
}) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents form from reloading
    if (!user) {
      console.error("User not logged in");
      return;
    }
    if (!comment.trim()) {
      console.error("Comment cannot be empty");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("comments").insert([
      {
        comment,
        post_id: Number(postId),
        user_id: user.id, // Ensuring user_id is handled correctly
        is_published: true,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error("Error adding comment:", error);
      return;
    }

    setComment(""); // Reset input field
    onCommentAdded(); // Callback to refresh comments
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", gap: 1, mt: 2 }}
    >
      <TextField
        label="Add Comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        fullWidth
        size="small"
      />
      <Button type="submit" variant="contained" disabled={loading}>
        {loading ? "Adding..." : "Add"}
      </Button>
    </Box>
  );
}
