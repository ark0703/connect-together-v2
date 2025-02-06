import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  Avatar,
  IconButton,
  Typography,
  CardActions,
  Box,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import { PostLikeUserType } from "../../types/types";
import { useAuth } from "../../contexts/AuthContext";
import supabase from "../../utils/supabase";
import readImage from "../../utils/readImage";
import ViewComments from "../ViewComments";
import dayjs from "dayjs"; // For date formatting

const PostCard: React.FC<PostLikeUserType> = (post) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [openComments, setOpenComments] = useState(false);
  const [commentCount, setCommentCount] = useState(post.comments?.length || 0);

  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const storedLikes = JSON.parse(localStorage.getItem("likedPosts") || "{}");
    if (storedLikes[post.id]) {
      setIsLiked(true);
      return;
    }

    const fetchLikes = async () => {
      const { data: likes, error } = await supabase
        .from("likes")
        .select("user_id")
        .eq("post_id", post.id);

      if (error) {
        console.error("Error fetching likes:", error);
        return;
      }

      const userLiked = likes.some((like) => like.user_id === user.id);
      setIsLiked(userLiked);

      if (userLiked) {
        localStorage.setItem(
          "likedPosts",
          JSON.stringify({ ...storedLikes, [post.id]: true })
        );
      }
    };

    fetchLikes();
  }, [user, post.id]);

  const handleLike = async () => {
    if (!user) return;

    const storedLikes = JSON.parse(localStorage.getItem("likedPosts") || "{}");

    if (!isLiked) {
      const { error } = await supabase
        .from("likes")
        .insert([{ post_id: post.id, user_id: user.id }]);

      if (error) {
        console.error("Error adding like:", error);
        return;
      }

      setIsLiked(true);
      setLikeCount((prev) => prev + 1);

      localStorage.setItem(
        "likedPosts",
        JSON.stringify({ ...storedLikes, [post.id]: true })
      );
    } else {
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("post_id", post.id)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error removing like:", error);
        return;
      }

      setIsLiked(false);
      setLikeCount((prev) => prev - 1);

      const updatedLikes = { ...storedLikes };
      delete updatedLikes[post.id];
      localStorage.setItem("likedPosts", JSON.stringify(updatedLikes));
    }
  };

  return (
    <Card
      sx={{
        mt: 2,
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: 2,
        p: 2,
      }}
    >
      {/* Header: Profile Image, Name & Timestamp */}
      <CardHeader
        avatar={
          <Avatar src={post?.user_id?.profile_pic || "/default-profile.png"} />
        }
        title={`${post?.user_id?.first_name ?? "Anonymous"} ${
          post?.user_id?.last_name ?? ""
        }`}
        subheader={post?.title ?? "No title available"}
        action={
          <Typography variant="caption" color="text.secondary">
            {dayjs(post?.created_at).format("MMM D, YYYY h:mm A")}
          </Typography>
        }
      />

      {/* Media (Image or Video) */}
      {post?.media?.map((mediaUrl: string, index: number) => (
        <CardMedia
          sx={{
            width: "100%",
            height: "auto",
            maxHeight: "60vh",
            objectFit: "cover",
          }}
          key={index}
          component="img"
          height="250px"
          image={readImage(mediaUrl)}
          alt="Post media"
        />
      ))}

      {/* Description */}
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {post?.description || "No description available"}
        </Typography>
      </CardContent>

      {/* Like & Comment Buttons */}
      <CardActions disableSpacing>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
            alignItems: "center",
            gap: 2,
          }}
        >
          <IconButton
            onClick={handleLike}
            aria-label="like"
            color={isLiked ? "primary" : "default"}
            sx={{ fontSize: "1.5rem" }} // Increase icon size
          >
            <FavoriteIcon sx={{ fontSize: 28 }} />
          </IconButton>
          <Typography variant="body2">{likeCount}</Typography>

          <IconButton
            aria-label="comment"
            color={openComments ? "primary" : "default"}
            onClick={() => setOpenComments(!openComments)}
            sx={{ fontSize: "1.5rem" }} // Increase icon size
          >
            <CommentIcon sx={{ fontSize: 28 }} />
          </IconButton>
          <Typography variant="body2">{commentCount}</Typography>
        </Box>
      </CardActions>

      {/* Comments Section */}
      {openComments && (
        <ViewComments
          postId={post.id}
          onCommentAdded={() => setCommentCount((prev) => prev + 1)}
        />
      )}
    </Card>
  );
};

export default PostCard;
