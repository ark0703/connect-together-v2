import { Box, LinearProgress } from "@mui/material";

export default function LinearLoader() {
  return (
    <Box
      sx={{ width: "100%", height: "100%" }}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <LinearProgress
        sx={{
          width: "50%",
        }}
      />
    </Box>
  );
}
