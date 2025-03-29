import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
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

const Login = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState({ status: false, message: "" });
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState({
    status: false,
    message: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Logging in");

    if (email === "" || !new RegExp(/.+@.+\..+/).test(email)) {
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
      return;
    }

    setEmailError({ status: false, message: "" });

    if (password === "" || password.length < 8) {
      setPasswordError({
        status: true,
        message: `${
          password === ""
            ? "Password is required"
            : password.length < 8
            ? "Password must contain at least 8 characters"
            : password.length > 25
            ? "Password must contain at most 25 characters"
            : ""
        }`,
      });

      return;
    }

    setPasswordError({ status: false, message: "" });

    supabase.auth.signInWithPassword({ email, password }).then(({ error }) => {
      if (error) {
        console.error(error);
        if (error.code === "invalid_credentials") {
          setError("Invalid email or password");
        }
        return;
      }
      navigate("/");
      console.log("Logged in");
    });
  };

  const OAuthLogin = async (provider: "google" | "github") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });

    if (error) {
      console.error("OAuth login error:", error.message);
    }
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
      {/* Logo */}
      <Box
        sx={{ mb: 2, width: "30%", display: "flex", justifyContent: "center" }}
      >
        <img
          src={Logo}
          alt="Logo"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </Box>

      {/* Header */}
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{ mb: 2, textAlign: "center" }}
      >
        Sign in to your account
      </Typography>

      {/* Form */}
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
        <TextField
          error={passwordError.status}
          helperText={passwordError.message}
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          onChange={(e) => setPassword(e.target.value.trim())}
          required
        />

        {/* Remember Me & Forgot Password */}
        <Box sx={{ display: "flex", justifyContent: "space-between", my: 1 }}>
          <FormControlLabel control={<Checkbox />} label="Remember me" />
          <Link to="/forgot-password">
            <Typography variant="body2" color="primary">
              Forgot password?
            </Typography>
          </Link>
        </Box>

        {/* Login Button */}
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2, py: 1 }}
          type="submit"
        >
          Sign in
        </Button>

        {/* Error Message */}
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>

        {/* Divider */}
        <Divider sx={{ my: 3 }}>Or continue with</Divider>

        {/* OAuth Buttons */}
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={() => OAuthLogin("google")}
          >
            Google
          </Button>
          <Button
            variant="outlined"
            startIcon={<GitHubIcon />}
            onClick={() => OAuthLogin("github")}
          >
            GitHub
          </Button>
        </Stack>

        {/* Signup Link */}
        <Typography textAlign="center" mt={3}>
          Not a member?{" "}
          <Link to={"/register"} style={{ textDecoration: "none" }}>
            <Typography
              component="span"
              color="primary"
              sx={{ cursor: "pointer" }}
            >
              Sign Up now
            </Typography>
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
