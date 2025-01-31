import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import supabase from "../utils/supabase";
import { useAuth } from "../contexts/AuthContext";

export default function AddComment({ postId }: { postId: number }) {
  const [comment, setComment] = useState("");
  const { user } = useAuth();

  return (
    <Box>
      <TextField
        label="Add Comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        fullWidth
      />
      <Button
        onClick={() => {
          if (!user) {
            console.error("User not logged in");
            return;
          }

          // Add comment to database
          supabase
            .from("comments")
            .insert({
              comment,
              post_id: Number(postId),
              user_id: Number(user.id),
              is_published: true,
            })
            .then(({ error }) => {
              if (error) {
                console.error(error);
                return;
              }
              console.log("Comment added");
            });
          setComment("");
        }}
      >
        Add
      </Button>
    </Box>
  );
}
