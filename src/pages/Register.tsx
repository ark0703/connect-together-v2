import {
  Box,
  Button,
  FormControl,
  FormGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import supabase from "../utils/supabase";
import { Link } from "react-router";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conPassword, setConPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <Box>
      <Typography variant={"h1"}>Register</Typography>
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
      <Link to="/login">Login</Link>
    </Box>
  );
}
