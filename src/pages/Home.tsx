import { Box, Typography } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import CreatePost from "../components/CreatePost";
import ViewPosts from "../components/ViewPosts";

export default function Home() {
  const { user } = useAuth();
  return (
    <Box>
      <Typography variant="h1">Your Home</Typography>
      {user?.can_post && <CreatePost />}

      <ViewPosts />
    </Box>
  );
}
