import { useEffect, useState, useRef, useCallback } from "react";
import { PostLikeUserType } from "../types/types";
import supabase from "../utils/supabase";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Typography,
  IconButton,
  Skeleton,
  Grid,
  CircularProgress,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import moment from "moment";
import readImage from "../utils/readImage";
import ViewComments from "./ViewComments";

export default function ViewPosts() {
  const [posts, setPosts] = useState<PostLikeUserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [openComments, setOpenComments] = useState<{ [key: number]: boolean }>(
    {}
  );
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useRef<HTMLDivElement | null>(null);
  const LIMIT = 1;
  const [offset, setOffset] = useState(0);

  // Fetch Posts Function
  const fetchPosts = useCallback(async () => {
    if (!hasMore) return;

    setFetchingMore(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*, user_id(*), comments(count), likes(count)")
      .order("created_at", { ascending: false })
      .range(offset, offset + LIMIT - 1);

    if (error) {
      console.error(error);
      setFetchingMore(false);
      return;
    }

    setPosts((prev) => {
      const uniquePosts = new Map();
      [...prev, ...data].forEach((p) => uniquePosts.set(p.id, p));
      return Array.from(uniquePosts.values());
    });

    setOffset((prevOffset) => prevOffset + LIMIT);
    setHasMore(data.length > 0);

    setFetchingMore(false);
    setLoading(false);
  }, [offset, hasMore]);

  // Fetch initial posts
  useEffect(() => {
    fetchPosts();
  }, [offset]); // Now it fetches new posts when offset updates

  // Infinite Scroll - Observer
  useEffect(() => {
    if (!hasMore || fetchingMore) return;

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        setOffset((prevOffset) => prevOffset + LIMIT); // Move this outside fetchPosts
      }
    };

    observer.current = new IntersectionObserver(observerCallback, {
      root: null,
      threshold: 1.0,
    });

    if (lastPostRef.current) {
      observer.current.observe(lastPostRef.current);
    }

    return () => observer.current?.disconnect();
  }, [posts, fetchingMore, hasMore]); // Rerun when posts change

  // Toggle comment section visibility
  const toggleCommentSection = (postId: number) => {
    setOpenComments((prev) => ({
      ...prev,
      [postId]: !prev[postId], // Toggle visibility
    }));
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{
        mt: 2,
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: 2,
      }}
    >
      {loading
        ? [...Array(3)].map((_, index) => (
            <Grid item xs={12} key={index}>
              <Card sx={{ borderRadius: "12px", boxShadow: 2 }}>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton width="60%" sx={{ ml: 2 }} />
                  </Box>
                  <Skeleton width="80%" sx={{ mt: 2 }} />
                </CardContent>
              </Card>
            </Grid>
          ))
        : posts.map((post, index) => (
            <Grid
              item
              xs={12}
              key={`${post.id}-${index}`}
              ref={index === posts.length - 1 ? lastPostRef : null}
            >
              <Card sx={{ borderRadius: "12px", boxShadow: 2 }}>
                {/* User Info */}
                <Box display="flex" alignItems="center" p={2}>
                  <Avatar
                    src={post.user_id.profile_pic || ""}
                    alt={post.user_id.username || "User"}
                  />
                  <Box ml={2}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {post.user_id?.username || "Unknown User"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {moment(post.created_at).fromNow()}
                    </Typography>
                  </Box>
                </Box>

                {/* Post Media */}
                {post.media.length > 0 && (
                  <CardMedia
                    component="img"
                    image={readImage(post.media[0])}
                    alt="Post Media"
                    sx={{
                      width: "100%",
                      height: "auto",
                      maxHeight: "80vh",
                      objectFit: "cover",
                    }}
                  />
                )}

                {/* Post Description */}
                <CardContent>
                  <Typography variant="body2">{post.description}</Typography>
                </CardContent>

                {/* Actions (Like & Comment) */}
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  p={2}
                >
                  <Box display="flex" alignItems="center">
                    <IconButton color="primary">
                      <FavoriteBorderIcon />
                    </IconButton>
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {post.likes?.length || 0}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center">
                    <IconButton
                      color="primary"
                      onClick={() => toggleCommentSection(post.id)}
                    >
                      <ChatBubbleOutlineIcon />
                    </IconButton>
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {post.comments.length || 0}
                    </Typography>
                  </Box>
                </Box>

                {/* Comments Section (Show only when toggled) */}
                {openComments[post.id] && (
                  <ViewComments
                    postId={post.id}
                    onCommentAdded={() => toggleCommentSection(post.id)}
                  />
                )}
              </Card>
            </Grid>
          ))}

      {/* Show loading spinner when fetching more */}
      {fetchingMore && (
        <Box display="flex" justifyContent="center" width="100%" my={2}>
          <CircularProgress />
        </Box>
      )}

      {/* Show message when all posts are loaded */}
      {!hasMore && !fetchingMore && (
        <Box textAlign="center" width="100%" my={2}>
          <Typography variant="body2" color="text.secondary">
            🎉 You've reached the end!
          </Typography>
        </Box>
      )}
    </Grid>
  );
}
