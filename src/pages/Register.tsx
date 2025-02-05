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
import { Link } from "react-router";
import Logo from "../assets/logo.svg";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conPassword, setConPassword] = useState("");
  const [emailError, setEmailError] = useState({ status: false, message: "" });
  const [passwordError, setPasswordError] = useState({
    status: false,
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
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
      setLoading(false);
      return;
    }
    setEmailError({ status: false, message: "" });

    if (password === "" || password.length < 8 || password.length > 25) {
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
      console.log("error setting up password");

      setLoading(false);
      return;
    }
    if (password !== conPassword) {
      console.log("error setting up confirm password");
      setPasswordError({
        status: true,
        message: "Password do not match",
      });
      console.log("Password do not match");

      setLoading(false);
      return;
    }
    setPasswordError({ status: false, message: "" });

    supabase.auth.signUp({ email, password }).then(({ error }) => {
      if (error) {
        console.error(error);

        setError(error.message);
        setLoading(false);

        return;
      }
      console.log("Logged in");
    });
  };

  return (
    <Box>
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
            Create your account
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
          <TextField
            error={passwordError.status}
            helperText={passwordError.message}
            fullWidth
            label=" Confirm Password"
            type="password"
            variant="outlined"
            margin="normal"
            onChange={(e) => setConPassword(e.target.value.trim())}
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
            <Typography
              variant="body2"
              color="primary"
              sx={{ cursor: "pointer" }}
            >
              <Link to="/forgot-password">Forgot password?</Link>
            </Typography>
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
            Already a member?{" "}
            <Link to={"/login"} style={{ textDecoration: "none" }}>
              <Typography
                component="span"
                color="primary"
                sx={{
                  cursor: "pointer",
                  underline: "none",
                }}
              >
                SignIn here{" "}
              </Typography>
            </Link>
          </Typography>
        </Box>
      </Box>

      {/* <Typography variant={"h1"}>Register</Typography>
      <FormGroup sx={{ marginTop: "1rem" }}>
        <FormControl fullWidth>
          <TextField
            error={email === "" || !new RegExp(/.+@.+\..+/).test(email)}
            helperText={
              email === ""
                ? "Email is required"
                : !new RegExp(/.+@.+\..+/).test(email)
                ? "Email is invalid"
                : ""
            }
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormControl>
        <FormControl fullWidth sx={{ marginTop: "1rem" }}>
          <TextField
            label="Password"
            type="password"
            helperText={
              password.length < 8 ? "Passord atleast contain 8 characters" : ""
            }
            error={password.length < 8}
            value={password}
            onChange={(e) => setPassword(e.target.value.trim())}
            required
          />
        </FormControl>
        <FormControl fullWidth sx={{ marginTop: "1rem" }}>
          <TextField
            label="Confirm Password"
            type="password"
            helperText={
              conPassword !== password ? "Passwords do not match" : ""
            }
            error={conPassword !== password}
            value={conPassword}
            onChange={(e) => setConPassword(e.target.value.trim())}
            required
          />
        </FormControl>

        <FormControl fullWidth sx={{ marginTop: "1rem" }}>
          <Button
            onClick={(e) => {
              e.preventDefault();
              console.log("Logging in");

              supabase.auth.signUp({ email, password }).then(({ error }) => {
                if (error) {
                  console.error(error);

                  if (error.code === "invalid_credentials") {
                    setError("Invalid email or password");
                  }

                  return;
                }
                console.log("Logged in");
              });
            }}
            type="submit"
            variant="contained"
            disabled={
              email === "" || new RegExp(/.+@.+\..+/).test(email) === false
            }
          >
            Register
          </Button>
          <Typography
            variant={"body2"}
            sx={{ color: "red", marginTop: "1rem" }}
            textAlign={"center"}
          >
            {error}
          </Typography>
        </FormControl>
      </FormGroup>
      <Link to="/login">Login</Link> */}
    </Box>
  );
}
