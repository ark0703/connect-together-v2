import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import supabase from "../utils/supabase";
import { useNavigate } from "react-router";
import Logo from "../assets/logo.svg";

export default function Login() {
  const [password, setPassword] = useState("");
  const [conPassword, setConPassword] = useState("");
  const [passwordError, setPasswordError] = useState({
    status: false,
    message: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    console.log("Logging in");

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

    const { data, error } = await supabase.auth.updateUser({
      password: password,
    });
    if (error) {
      console.error(error);
      setError(error.message);
      return;
    }
    if (data) {
      navigate("/login");
    }
    console.log("Logged in", data);
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
            fontSize: {
              xs: "1.5rem",
              sm: "2rem",
              md: "2.5rem",
              lg: "3rem",
            },
            width: "100%", // Ensures it takes up available width
            textAlign: "center", // Centers text if needed
          }}
        >
          Update Your Password
        </Typography>
      </Box>

      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        {/* Passwords Fields */}
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

        {/* update-password Button */}
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2, py: 1 }}
          type="submit"
        >
          Update Password
        </Button>
      </form>

      {/* Error Message */}
      <Typography variant="body2" color="error" sx={{ mt: 2 }}>
        {error}
      </Typography>
    </Box>
  );
}
