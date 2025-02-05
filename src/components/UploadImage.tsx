import { Delete } from "@mui/icons-material";
import { Box, Button, Icon, IconButton } from "@mui/material";
import { useRef } from "react";

export default function UploadImage({
  images,
  setImages,
  maxImages = 1,
}: {
  images: File[];
  setImages: (images: File[]) => void;
  maxImages?: number;
}) {
  const inputFile = useRef<HTMLInputElement | null>(null);
  console.log(maxImages);

  return (
    <Box>
      <input
        type="file"
        ref={inputFile}
        accept="image/png, image/gif, image/jpeg"
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files) {
            setImages([...images, ...Array.from(e.target.files)]);
          }
        }}
      />
      <Box
        sx={{ display: "flex", gap: 2 }}
        onDrop={(e) => {
          e.preventDefault();
          setImages([...images, ...Array.from(e.dataTransfer.files)]);
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => inputFile.current?.click()}
        >
          Upload
        </Button>
      </Box>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
        {images.map((image, index) => (
          <Box key={index} width={200} position="relative">
            <img
              src={URL.createObjectURL(image)}
              alt="Uploaded"
              width={"100%"}
            />

            <IconButton
              sx={{ position: "absolute", top: 0, right: 0 }}
              onClick={() => {
                setImages(images.filter((_, i) => i !== index));
              }}
            >
              <Icon>
                <Delete color="error" />
              </Icon>
            </IconButton>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
