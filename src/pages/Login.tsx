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

export default function Login() {
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
            ? "Password must contain atleast 8 charcters"
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
      navigate("/home");

      console.log("Logged in");
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
          Sign in to your account
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

        {/* Remember me & Forgot password */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            my: 1,
          }}
        >
          <FormControlLabel control={<Checkbox />} label="Remember me" />
          <Link to="/forgot-password">
            <Typography
              variant="body2"
              color="primary"
              sx={{ cursor: "pointer" }}
            >
              Forgot password?
            </Typography>
          </Link>
        </Box>

        {/* Sign-in Button */}
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
            sx={{ width: "50%" }}
          >
            Google
          </Button>
          <Button
            variant="outlined"
            startIcon={<GitHubIcon />}
            sx={{ width: "50%" }}
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
              sx={{
                cursor: "pointer",
                underline: "none",
              }}
            >
              SignUp now{" "}
            </Typography>
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
