import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Box, Typography, CircularProgress } from "@mui/material";
import PostCard from "../components/PagesComponent/PostCard";
import supabase from "../utils/supabase";
import { PostLikeUserType } from "../types/types";

const FeedPage = () => {
  const { type } = useParams<{ type: string }>();
  const [posts, setPosts] = useState<PostLikeUserType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch posts from database
    supabase
      .from("posts")
      .select("*, user_id(*), likes(*, user_id(*)), comments(*, user_id(*))")
      .eq("type", type || "")
      .order("created_at", { ascending: false })
      .range(0, 19)
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
          return;
        }
        setPosts(data);
        setLoading(false);
      });
  }, []);

  return (
    <Box
      sx={{
        maxWidth: {
          xs: "95%", // Full width on extra-small screens
          sm: "440px", // Small screens
          md: "620px", // Medium screens
          lg: "860px", // Large screens
          xl: "1140px", // Extra-large screens
        },
        margin: "auto",
      }}
    >
      <Typography variant="h4" gutterBottom>
        {type === "events" ? "Events" : type === "jobs" && "Jobs"}
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        posts.map((post) => <PostCard key={post.id} {...post} />)
      )}
    </Box>
  );
};

export default FeedPage;
