import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../contexts/AuthContext";
import supabase from "../utils/supabase";
import { PostType } from "../types/types";

const MyPosts: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!user) return;
    fetchMyPosts();
  }, [user]);

  const fetchMyPosts = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error.message);
        return;
      }

      setPosts(data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: number | undefined) => {
    if (!user || postId === undefined) return;

    if (!window.confirm("Are you sure you want to delete this post?")) return;

    setDeleting(postId);
    try {
      const { error } = await supabase.from("posts").delete().eq("id", postId);

      if (error) {
        console.error("Error deleting post:", error.message);
        return;
      }

      setPosts((prev) => prev.filter((post) => post.id !== postId));
    } finally {
      setDeleting(undefined);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Posts
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : !user ? (
        <Typography>Please log in to see your posts.</Typography>
      ) : posts.length === 0 ? (
        <Typography>No posts found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {post.media.length > 0 && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={post.media[0]} // Display first media file
                    alt={post.title}
                  />
                )}
                <CardContent>
                  <Typography variant="h6">{post.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {post.description}
                  </Typography>
                  <Typography variant="caption" display="block" gutterBottom>
                    {new Date(post.created_at || "").toLocaleDateString()}
                  </Typography>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(post.id)}
                    disabled={deleting === post.id}
                    startIcon={<DeleteIcon />}
                    fullWidth
                    sx={{ mt: 1 }}
                  >
                    {deleting === post.id ? "Deleting..." : "Delete"}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MyPosts;
