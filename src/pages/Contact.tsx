import React from "react";
import { Box, TextField, Button, Typography, Stack } from "@mui/material";
import { Email, LocationOn, Phone } from "@mui/icons-material";

const ContactPage: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        height: "100vh",
        p: 4,
      }}
    >
      {/* Left Section */}
      <Box sx={{ flex: 1, pr: { md: 4 } }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Get in touch
        </Typography>
        <Typography variant="body1" paragraph>
          Proin volutpat consequat porttitor cras nullam gravida at. Orci
          molestie a eu arcu. Sed ut tincidunt integer elementum id sem. Arcu
          sed malesuada et magna.
        </Typography>
        <Stack spacing={1} mt={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <LocationOn color="primary" />
            <Typography>545 Mavis Island, Chicago, IL 99191</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Phone color="primary" />
            <Typography>+1 (555) 234-5678</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Email color="primary" />
            <Typography>hello@example.com</Typography>
          </Stack>
        </Stack>
      </Box>

      {/* Right Section */}
      <Box
        component="form"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          bgcolor: "background.paper",
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField label="First name" variant="outlined" fullWidth />
          <TextField label="Last name" variant="outlined" fullWidth />
        </Stack>
        <TextField label="Email" variant="outlined" fullWidth />
        <TextField label="Phone number" variant="outlined" fullWidth />
        <TextField
          label="Message"
          variant="outlined"
          multiline
          rows={4}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ alignSelf: "flex-start" }}
        >
          Send message
        </Button>
      </Box>
    </Box>
  );
};

export default ContactPage;
