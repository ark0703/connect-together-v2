import React from "react";
import { TextField, Button, Box, MenuItem } from "@mui/material";

const Form: React.FC = () => {
  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: 400,
        margin: "auto",
        padding: 2,
      }}
      noValidate
      autoComplete="off"
    >
      <TextField label="First Name" variant="outlined" fullWidth required />
      <TextField label="Last Name" variant="outlined" fullWidth required />
      <TextField label="Phone" variant="outlined" fullWidth required />
      <TextField
        label="Department"
        variant="outlined"
        fullWidth
        required
        select
      >
        <MenuItem value="CSE">CSE</MenuItem>
        <MenuItem value="ECE">ECE</MenuItem>
        <MenuItem value="ME">ME</MenuItem>
        <MenuItem value="CE">CE</MenuItem>
      </TextField>
      <TextField label="Course" variant="outlined" fullWidth required />
      <TextField label="Username" variant="outlined" fullWidth required />
      <TextField label="College" variant="outlined" fullWidth required />
      <TextField label="Batch" variant="outlined" fullWidth required />
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </Box>
  );
};

export default Form;
