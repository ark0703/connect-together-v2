import { Box, Button, TextareaAutosize, TextField } from "@mui/material";
import UploadImage from "./UploadImage";
import { useState } from "react";
import supabase from "../utils/supabase";
import { useAuth } from "../contexts/AuthContext";

export default function CreatePost() {
  const [images, setImages] = useState<File[]>([]);
  const [title, setTitle] = useState<string>("");

  const { user } = useAuth();

  return (
    <Box>
      <UploadImage images={images} setImages={setImages} maxImages={5} />
      <TextareaAutosize
        minRows={3}
        maxRows={10}
        placeholder="What's on your mind?"
        style={{ width: "100%", fontSize: "1.1rem", padding: "1rem" }}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={(e) => {
          e.preventDefault();
          console.log({ title, images });

          if (!user) {
            console.error("User not logged in");
            return;
          }

          Promise.all(
            images.map((image) => {
              const filePath = `public/${
                // @ts-ignore
                new Date().getTime() + "_" + image.name.replaceAll(" ", "_")
              }`;
              return supabase.storage.from("posts").upload(filePath, image);
            })
          ).then((res) => {
            const errors = res.filter((r) => r.error);
            if (errors.length) {
              console.error(errors);
              return;
            }

            const files = res
              .map((r) => r.data?.fullPath)
              .filter((path): path is string => !!path);

            supabase
              .from("posts")
              .insert([
                {
                  media: files, // assuming you want to store image names
                  user_id: user.id, // replace with actual user_id
                  description: title,
                  type: "post",
                },
              ])
              .then(({ data, error }) => {
                if (error) {
                  console.error(error);
                  return;
                }
                console.log(data);
              });
          });
        }}
      >
        Post
      </Button>
    </Box>
  );
}
