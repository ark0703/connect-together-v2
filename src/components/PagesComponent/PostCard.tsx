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
import readImage from "../../utils/readImage";
import { useAuth } from "../../contexts/AuthContext";
import supabase from "../../utils/supabase";

const PostCard: React.FC<PostLikeUserType> = (post) => {
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !post.likes) return;
    setIsLiked(post.likes && !!post.likes.find((l) => l.user_id?.id === 1));
  }, [user, post]);

  return (
    <Card
      sx={{
        maxWidth: 500,
        bgcolor: "background.paper",
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      {/* Header: Profile Image & Name */}
      <CardHeader
        avatar={
          <Avatar
            src={post?.user_id?.profile_pic || "/default-profile.png"}
            alt={post?.user_id?.first_name ?? "User"}
          />
        }
        title={`${post?.user_id?.first_name ?? "Anonymous"} ${
          post?.user_id?.last_name ?? ""
        }`.trim()}
        subheader={post?.title ?? "No title available"}
      />

      {/* Media (Image or Video) */}
      {post?.media?.map((mediaUrl, index) => (
        <CardMedia
          key={index}
          component="img"
          height="250"
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
          onClick={() => {
            if (!user) return;
            if (!isLiked) {
              supabase
                .from("likes")
                .insert([
                  {
                    post_id: post.id,
                    user_id: user.id,
                  },
                ])
                .then(({ error }) => {
                  if (error) {
                    console.error(error);
                    setIsLiked(false);
                  } else {
                    console.log("Like updated successfully");
                  }
                });
            } else {
              supabase
                .from("likes")
                .delete()
                .eq("post_id", post.id)
                .eq("user_id", user.id)
                .then(({ error }) => {
                  if (error) {
                    console.error(error);
                    setIsLiked(true);
                  } else {
                    console.log("Like removed successfully");
                  }
                });
            }
            setIsLiked(!isLiked);
          }}
          aria-label="like"
          color={isLiked ? "primary" : "default"}
        >
          <FavoriteIcon />
          {post.likes.length}
        </IconButton>
        <IconButton aria-label="comment" color="secondary">
          <CommentIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default PostCard;
