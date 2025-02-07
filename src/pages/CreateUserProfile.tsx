import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Paper,
  TextField,
  MenuItem,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import supabase from "../utils/supabase";
import { UserType } from "../types/types";
export default function UserProfile() {
  const { user: authUser, signOut, sb_user } = useAuth();

  const [user, setUser] = useState<UserType | null>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<UserType>>({});
  const [customDepartment, setCustomDepartment] = useState("");

  const departments = ["CSE", "ECE", "ME", "CE", "Other"];

  useEffect(() => {
    if (!authUser) {
      setEditing(!authUser);
      return;
    }
    sb_user;

    setEditing(!authUser);
    setUser(authUser);
    setFormData(authUser);
  }, [authUser]);

  const handleUpdateClick = () => setEditing(true);

  const handleChange = (field: keyof UserType, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!sb_user) {
      console.error("No authenticated user found.");
      return;
    }

    let updateData = { ...formData };

    // If department is "Other", use the customDepartment value
    if (updateData.department === "Other") {
      updateData.department = customDepartment;
    }

    // Ensure all required fields are filled
    const userData = {
      uuid: sb_user.id,
      email: sb_user.email,
      first_name: updateData.first_name || "",
      last_name: updateData.last_name || "",
      username: updateData.username || sb_user.email.split("@")[0], // Default username
      phone: updateData.phone || "",
      college: updateData.college || "",
      course: updateData.course || "",
      batch: updateData.batch || "",
      department: updateData.department || "",
      status: true,
      is_alimony: updateData.is_alimony ?? false,
    };

    // Check if user exists, then update or insert
    const { data: existingUser } = await supabase
      .from("users")
      .select("uuid")
      .eq("uuid", sb_user.id)
      .maybeSingle();

    if (existingUser) {
      // Update the existing user
      const { error } = await supabase
        .from("users")
        .update(userData)
        .eq("uuid", sb_user.id);
      if (error) console.error("Error updating user:", error.message);
    } else {
      // Insert new user
      const { error } = await supabase.from("users").insert(userData);
      if (error) console.error("Error inserting user:", error.message);
    }
  };

  return (
    <Box
      p={4}
      sx={{ width: "100%", display: "flex", justifyContent: "center" }}
    >
      <Box sx={{ maxWidth: { xs: "100%", md: "900px" }, width: "100%" }}>
        <Typography variant="h5" gutterBottom>
          Applicant Information
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          Personal details and application.
        </Typography>
        <TableContainer
          component={Paper}
          sx={{ width: "100%", overflowX: "auto" }}
        >
          <Table>
            <TableBody>
              {[
                { label: "First Name", key: "first_name", editable: true },
                { label: "Last Name", key: "last_name", editable: true },
                { label: "Username", key: "username", editable: !user },
                { label: "Phone", key: "phone", editable: true },
                { label: "College", key: "college", editable: true },
                { label: "Course", key: "course", editable: true },
                { label: "Batch", key: "batch", editable: true },
              ].map(({ label, key, editable }) => (
                <TableRow key={key}>
                  <TableCell>
                    <b>{label}</b>
                  </TableCell>
                  <TableCell>
                    {editing && editable ? (
                      <TextField
                        fullWidth
                        value={formData[key as keyof UserType] || ""}
                        onChange={(e) =>
                          handleChange(key as keyof UserType, e.target.value)
                        }
                        required
                      />
                    ) : (
                      user?.[key as keyof UserType] || "—"
                    )}
                  </TableCell>
                </TableRow>
              ))}

              {/* Show Email Address Only If User Exists */}
              {user && (
                <TableRow>
                  <TableCell>
                    <b>Email Address</b>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                </TableRow>
              )}

              {/* Are You an Alimony (Dropdown) */}
              <TableRow>
                <TableCell>
                  <b>Are you an alimony?</b>
                </TableCell>
                <TableCell>
                  {editing ? (
                    <TextField
                      select
                      fullWidth
                      value={
                        formData.is_alimony !== undefined
                          ? String(formData.is_alimony)
                          : ""
                      }
                      onChange={(e) =>
                        handleChange("is_alimony", e.target.value === "true")
                      }
                      required
                    >
                      <MenuItem value="true">Yes</MenuItem>
                      <MenuItem value="false">No</MenuItem>
                    </TextField>
                  ) : user?.is_alimony ? (
                    "Yes"
                  ) : (
                    "No"
                  )}
                </TableCell>
              </TableRow>

              {/* Department Dropdown */}
              <TableRow>
                <TableCell>
                  <b>Department</b>
                </TableCell>
                <TableCell>
                  {editing ? (
                    <>
                      <TextField
                        select
                        fullWidth
                        sx={{ mb: 1 }}
                        value={formData.department || ""}
                        onChange={(e) =>
                          handleChange("department", e.target.value)
                        }
                        required
                      >
                        {departments.map((dept) => (
                          <MenuItem key={dept} value={dept}>
                            {dept}
                          </MenuItem>
                        ))}
                      </TextField>
                      {formData.department === "Other" && (
                        <TextField
                          fullWidth
                          placeholder="Enter Department"
                          value={customDepartment}
                          onChange={(e) => setCustomDepartment(e.target.value)}
                        />
                      )}
                    </>
                  ) : (
                    user?.department || "—"
                  )}
                </TableCell>
              </TableRow>

              {/* Buttons */}
              {user ? (
                <TableRow>
                  <TableCell colSpan={2} align="right">
                    {editing ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                      >
                        Save Changes
                      </Button>
                    ) : (
                      <Button variant="outlined" onClick={handleUpdateClick}>
                        Update
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell colSpan={1} align="left">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={signOut}
                    >
                      Logout
                    </Button>
                  </TableCell>
                  <TableCell colSpan={2} align="right">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                    >
                      Submit
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
