import { useEffect, useState, useRef, useCallback } from "react";
import { PostLikeUserType } from "../types/types";
import supabase from "../utils/supabase";
import { Box, Typography, CircularProgress } from "@mui/material";
import PostCard from "./PagesComponent/PostCard";
import LinearLoader from "./LinearLoader";

export default function ViewPosts() {
  const [posts, setPosts] = useState<PostLikeUserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const hasMoreRef = useRef(true); // Use useRef to track `hasMore`
  const lastPostRef = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const LIMIT = 5;
  const offsetRef = useRef(0);

  // Fetch Posts Function
  const fetchPosts = useCallback(async () => {
    if (!hasMoreRef.current || fetchingMore) return;
    setFetchingMore(true);

    console.log("Fetching posts from offset:", offsetRef.current);

    const { data, error } = await supabase
      .from("posts")
      .select("*, user_id(*), likes(*, user_id(*)), comments(*, user_id(*))")
      .order("created_at", { ascending: false })
      .range(offsetRef.current, offsetRef.current + LIMIT - 1);

    if (error) {
      console.error("Error fetching posts:", error);
      setFetchingMore(false);
      return;
    }

    setPosts((prev) => {
      const uniquePosts = new Map();
      [...prev, ...data].forEach((p) => uniquePosts.set(p.id, p));
      return Array.from(uniquePosts.values());
    });

    offsetRef.current += LIMIT; // Update offset using useRef
    hasMoreRef.current = data.length === LIMIT; // Update hasMoreRef
    setFetchingMore(false);
    setLoading(false);
  }, [fetchingMore]);

  // Initial Fetch
  useEffect(() => {
    fetchPosts();
  }, []); // No dependency on offset

  // Infinite Scroll Observer
  useEffect(() => {
    if (!hasMoreRef.current || fetchingMore) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          console.log("Last post is visible, fetching more...");
          fetchPosts();
        }
      },
      { root: null, threshold: 0.5 } // Trigger when 50% of last post is visible
    );

    if (lastPostRef.current) {
      observer.current.observe(lastPostRef.current);
    }

    return () => observer.current?.disconnect();
  }, [posts, fetchingMore]); // Ensure observer updates when posts change

  // Realtime Subscription (Listen for new posts)
  useEffect(() => {
    const channel = supabase
      .channel("realtime-posts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        (payload) => {
          setPosts((prevPosts) => {
            const newPost = payload.new as PostLikeUserType;
            const existingPost = prevPosts.find((p) => p.id === newPost.id);
            if (!existingPost) {
              return [newPost, ...prevPosts];
            }
            return prevPosts;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Box
      sx={{
        maxWidth: {
          xs: "95%", // Full width on extra-small screens
          sm: "440px", // Small screens
          md: "620px", // Medium screens
          lg: "760px", // Large screens
          xl: "1140px", // Extra-large screens
        },
        margin: "auto",
      }}
    >
      {loading ? (
        <LinearLoader />
      ) : (
        posts.map((post, index) => (
          <Box
            key={post.id}
            ref={index === posts.length - 1 ? lastPostRef : null}
          >
            <PostCard {...post} />
          </Box>
        ))
      )}

      {/* Show loading spinner when fetching more */}
      {fetchingMore && (
        <Box display="flex" justifyContent="center" width="100%" my={2}>
          <CircularProgress />
        </Box>
      )}

      {/* Show message when all posts are loaded */}
      {!hasMoreRef.current && !fetchingMore && (
        <Box textAlign="center" width="100%" my={2}>
          <Typography variant="body2" color="text.secondary">
            🎉 You've reached the end!
          </Typography>
        </Box>
      )}
    </Box>
  );
}
