import { useEffect, useState } from "react";
import { PostUserType } from "../types/types";
import supabase from "../utils/supabase";
import { Box, Typography } from "@mui/material";
import moment from "moment";
import readImage from "../utils/readImage";

export default function ViewPosts() {
  const [posts, setPosts] = useState<PostUserType[]>([]);

  useEffect(() => {
    // Fetch posts from database
    supabase
      .from("posts")
      .select("*, user_id(*)")
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
          return;
        }
        setPosts(data);
      });
  }, []);

  return (
    <Box>
      {posts.map((post) => (
        <Box key={post.id}>
          {post.media.map((media) => {
            return (
              <img
                src={readImage(media)}
                alt="post"
                style={{ width: "100%" }}
              />
            );
          })}
          <Typography>{post.description}</Typography>
          <Typography>
            {moment(post.created_at).fromNow()} by {post.user_id.username}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
