import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import supabase from "../utils/supabase";
import { Link, useNavigate } from "react-router";
import Logo from "../assets/logo.svg";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import { option } from "motion/react-client";

export default function Login() {
  const url = window.location.origin;
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState({ status: false, message: "" });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    console.log("Logging in");

    if (email === "" || !new RegExp(/.+@.+\..+/).test(email)) {
      console.log("Please enter a valid email");

      setEmailError({
        status: true,
        message: `${
          email === ""
            ? "Email is required"
            : !new RegExp(/.+@.+\..+/).test(email)
            ? "Email is invalid"
            : ""
        }`,
      });
      setLoading(false);
      return;
    }
    setEmailError({ status: false, message: "" });
    await supabase.auth
      .resetPasswordForEmail(email, { redirectTo: `${url}/update-password` })
      .then(({ error }) => {
        if (error) {
          console.error(error);
          setError("Failed to send password reset email");
          return;
        }
        setError("Password reset email sent successfully. Check your inbox.");
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 8,
        p: 4,
        borderRadius: 2,
        boxShadow: 3,
        bgcolor: "background.paper",
      }}
    >
      {/* lOGO */}
      <Box
        sx={{
          mb: 2,
          width: { xs: "50%", sm: "40%", md: "30%", lg: "25%" },
          display: "flex",
          justifyContent: "center",
        }}
      >
        <img
          src={Logo}
          alt="Logo"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </Box>

      {/* Header Text */}
      <Box sx={{ mb: 2, width: "80%" }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem", lg: "3rem" },
            width: "100%", // Ensures it takes up available width
            textAlign: "center", // Centers text if needed
          }}
        >
          Enter email to recieve a reset password link
        </Typography>
      </Box>

      {/* Email & Password Fields */}
      <Box component="form" width="100%" onSubmit={handleSubmit}>
        <TextField
          error={emailError.status}
          helperText={emailError.message}
          fullWidth
          label="Email address"
          variant="outlined"
          margin="normal"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Sign-in Button */}
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2, py: 1 }}
          type="submit"
        >
          Get Link
        </Button>

        {/* Error Message */}
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>

        {/* Divider */}
        <Divider sx={{ my: 3 }}>Or </Divider>

        {/* Signup Link */}
        <Typography textAlign="center" mt={3}>
          get back to{" "}
          <Link to={"/login"} style={{ textDecoration: "none" }}>
            <Typography
              component="span"
              color="primary"
              sx={{
                cursor: "pointer",
                underline: "none",
              }}
            >
              SignIn Page{" "}
            </Typography>
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
