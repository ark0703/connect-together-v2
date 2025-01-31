import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { UserType } from "../types/types";
import { Checkbox, FormControlLabel } from "@mui/material";
import supabase from "../utils/supabase";

export default function CreateUserProfile() {
  const [user, setUser] = useState<UserType>({
    id: 0,
    first_name: "",
    last_name: "",
    phone: "",
    department: "",
    course: "",
    username: "",
    college: "pathkarvarde",
    batch: "",
    can_post: false,
    uuid: "",
    status: false,
    created_at: "",
    email: "",
    is_alimony: false,
    profile_pic: null,
  });

  const handleSubmit = () => {
    supabase.auth.getUser().then(({ data: { user: sbUser }, error }) => {
      if (error) {
        console.error(error);
        return;
      }

      if (!sbUser) {
        console.error("User not found");
        return;
      }

      supabase
        .from("users")
        .insert([
          {
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone,
            department: user.department,
            course: user.course,
            username: user.username,
            college: user.college,
            batch: user.batch,
            can_post: user.can_post,
            uuid: sbUser.id,
            status: user.status,
            email: sbUser.email ?? "",
            is_alimony: user.is_alimony,
            profile_pic: user.profile_pic,
          },
        ])
        .then(({ data, error }) => {
          if (error) {
            console.error(error);
            return;
          }
          window.location.reload();
          console.log(data);
        });
    });
  };

  return (
    <Box>
      <Typography variant="h1">Create User Profile</Typography>

      <FormGroup>
        <FormControl>
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            required
            value={user.first_name}
            onChange={(e) => setUser({ ...user, first_name: e.target.value })}
          />
        </FormControl>
        <FormControl>
          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            required
            value={user.last_name}
            onChange={(e) => setUser({ ...user, last_name: e.target.value })}
          />
        </FormControl>
        <FormControl>
          <TextField
            label="Phone"
            variant="outlined"
            fullWidth
            required
            value={user.phone}
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
          />
        </FormControl>

        <FormControl>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            required
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
          />
        </FormControl>
        <FormControl>
          <Autocomplete
            options={["CSE", "ECE", "ME", "CE"]}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Department"
                variant="outlined"
                required
              />
            )}
            value={user.department}
            onChange={(_, value) =>
              setUser({ ...user, department: value ?? "" })
            }
          />
        </FormControl>
        <FormControl>
          <TextField
            label="Course"
            variant="outlined"
            fullWidth
            required
            value={user.course}
            onChange={(e) => setUser({ ...user, course: e.target.value })}
          />
        </FormControl>
        <FormControl>
          <Autocomplete
            options={new Array(new Date().getFullYear() - 1970)
              .fill(0)
              .map((_, i) => `${i + 1970}`)
              .reverse()}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Batch"
                variant="outlined"
                required
              />
            )}
            value={user.batch}
            onChange={(_, value) => setUser({ ...user, batch: value ?? "" })}
          />
        </FormControl>
        <FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={user.is_alimony}
                onChange={(e) =>
                  setUser({ ...user, is_alimony: e.target.checked })
                }
              />
            }
            label="Are you an alimony?"
          />
        </FormControl>
      </FormGroup>

      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Box>
  );
}
