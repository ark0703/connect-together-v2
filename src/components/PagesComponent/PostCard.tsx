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
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import { PostLikeUserType } from "../../types/types";
import { useAuth } from "../../contexts/AuthContext";
import supabase from "../../utils/supabase";
import readImage from "../../utils/readImage";
import ViewComments from "../ViewComments";

const PostCard: React.FC<PostLikeUserType> = (post) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [openComments, setOpenComments] = useState(false);
  const [commentCount, setCommentCount] = useState(post.comments?.length || 0);

  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Load like status from localStorage
    const storedLikes = JSON.parse(localStorage.getItem("likedPosts") || "{}");
    if (storedLikes[post.id]) {
      setIsLiked(true);
      return;
    }

    // Fetch all likes for the post
    const fetchLikes = async () => {
      const { data: likes, error } = await supabase
        .from("likes")
        .select("user_id")
        .eq("post_id", post.id);

      if (error) {
        console.error("Error fetching likes:", error);
        return;
      }

      // Check if the user already liked the post
      const userLiked = likes.some((like) => like.user_id === user.id);
      setIsLiked(userLiked);

      // Save to local storage
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
      // Add like
      const { error } = await supabase
        .from("likes")
        .insert([{ post_id: post.id, user_id: user.id }]);

      if (error) {
        console.error("Error adding like:", error);
        return;
      }

      setIsLiked(true);
      setLikeCount((prev) => prev + 1);

      // Update local storage
      localStorage.setItem(
        "likedPosts",
        JSON.stringify({ ...storedLikes, [post.id]: true })
      );
    } else {
      // Remove like
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

      // Remove from local storage
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
      }}
    >
      {/* Header: Profile Image & Name */}
      <CardHeader
        avatar={
          <Avatar src={post?.user_id?.profile_pic || "/default-profile.png"} />
        }
        title={`${post?.user_id?.first_name ?? "Anonymous"} ${
          post?.user_id?.last_name ?? ""
        }`}
        subheader={post?.title ?? "No title available"}
      />

      {/* Media (Image or Video) */}
      {post?.media?.map((mediaUrl: string, index: number) => (
        <CardMedia
          sx={{
            width: "100%",
            height: "auto",
            maxHeight: "80vh",
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
        <IconButton
          onClick={handleLike}
          aria-label="like"
          color={isLiked ? "primary" : "default"}
        >
          <FavoriteIcon />
        </IconButton>
        <Typography variant="body2">{likeCount}</Typography>

        <IconButton
          aria-label="comment"
          color={openComments ? "primary" : "default"}
          onClick={() => setOpenComments(!openComments)}
        >
          <CommentIcon />
        </IconButton>
        <Typography variant="body2">{commentCount}</Typography>
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
