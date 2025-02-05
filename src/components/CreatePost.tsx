import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextareaAutosize,
  Box,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import UploadImage from "./UploadImage";
import supabase from "../utils/supabase";
import { useAuth } from "../contexts/AuthContext";
import { PostType } from "../types/types";

interface CreatePostPopupProps {
  open: boolean;
  handleClose: () => void;
}

export default function CreatePostPopup({
  open,
  handleClose,
}: CreatePostPopupProps) {
  const [images, setImages] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [postType, setPostType] = useState<string>("others");

  const { user } = useAuth();

  const handlePostTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: string | null
  ) => {
    if (newType) {
      setPostType(newType);
    }
  };

  const handlePost = async () => {
    if (!user) {
      console.error("User not logged in");
      return;
    }

    try {
      const uploadedImages = await Promise.all(
        images.map(async (image) => {
          // Sanitize file name (remove special characters)
          const sanitizedFileName = image.name.replace(/[^a-zA-Z0-9_.-]/g, ""); // Remove invalid characters
          const filePath = `public/${Date.now()}_${sanitizedFileName}`;

          const { data, error } = await supabase.storage
            .from("posts") // Make sure the bucket name is correct
            .upload(filePath, image);

          if (error) throw error;
          return data?.fullPath;
        })
      );

      const newPost: PostType = {
        id: Date.now(),
        description: description,
        created_at: new Date().toISOString(),
        media: uploadedImages,
        user_id: user.id, // Assigning the entire user object
        is_publishes: true,
        type: "post",
        title: title,
      };

      await supabase.from("posts").insert([newPost]);

      setTitle("");
      setImages([]);
      handleClose();
    } catch (error) {
      console.error("Error uploading post:", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Create a Post</DialogTitle>
      <DialogContent>
        <Box display="flex" justifyContent="center" mb={2}>
          <ToggleButtonGroup
            value={postType}
            exclusive
            onChange={handlePostTypeChange}
            aria-label="post type"
          >
            <ToggleButton value="jobs" aria-label="jobs">
              Job
            </ToggleButton>
            <ToggleButton value="events" aria-label="events">
              Event
            </ToggleButton>
            <ToggleButton value="others" aria-label="others">
              Others
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <UploadImage images={images} setImages={setImages} maxImages={5} />
        <TextareaAutosize
          minRows={1}
          maxRows={3}
          placeholder="Enter Title"
          style={{
            width: "100%",
            fontSize: "1rem",
            padding: "1rem",
            marginTop: "1rem",
          }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextareaAutosize
          minRows={3}
          maxRows={10}
          placeholder="What's on your mind?"
          style={{
            width: "100%",
            fontSize: "1.1rem",
            padding: "1rem",
            marginTop: "1rem",
          }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handlePost} variant="contained" color="primary">
          Post
        </Button>
      </DialogActions>
    </Dialog>
  );
}
