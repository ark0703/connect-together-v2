import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Box, Card, Typography, CircularProgress } from "@mui/material";
import PostCard from "../components/PagesComponent/PostCard";
import supabase from "../utils/supabase";
import { PostLikeUserType, PostUserType } from "../types/types";
import readImage from "../utils/readImage";
import moment from "moment";

const FeedPage = () => {
  const { type } = useParams<{ type: string }>();
  const [posts, setPosts] = useState<PostLikeUserType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch posts from database
    supabase
      .from("posts")
      .select("*, user_id(*), likes(*, user_id(*)), comments(*, user_id(*))")
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
    <Box sx={{ maxWidth: 600, margin: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {type === "events" ? "Events" : "Jobs"}
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        posts.map((post) => (
          <Card key={post.id} sx={{ mb: 2, p: 2 }}>
            <PostCard {...post} />
          </Card>
        ))
      )}
    </Box>
  );
};

export default FeedPage;
