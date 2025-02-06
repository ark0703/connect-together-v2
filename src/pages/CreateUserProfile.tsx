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
  const { user: authUser } = useAuth();

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

    setEditing(!authUser);
    setUser(authUser);
    setFormData(authUser);
  }, [authUser]);

  const handleUpdateClick = () => setEditing(true);

  const handleChange = (field: keyof UserType, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!authUser) return;

    const updateData = { ...formData };
    if (updateData.department === "Other") {
      updateData.department = customDepartment;
    }

    const { error } = user
      ? await supabase
          .from("users")
          .update(updateData)
          .eq("uuid", authUser.uuid)
      : await supabase.from("users").insert([
          {
            ...updateData,
            uuid: authUser.uuid,
            batch: "",
            course: "",
            department: "",
            email: authUser.email,
            first_name: "",
            last_name: "",
            phone: "",
            status: true,
            username: "",
            is_alimony: false,
          },
        ]);

    if (error) {
      console.error(error);
    } else {
      setUser(updateData as UserType);
      setEditing(false);
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
