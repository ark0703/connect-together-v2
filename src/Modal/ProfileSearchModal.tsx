import { useEffect, useState } from "react";
import supabase from "../utils/supabase";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Dialog,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ProfileSearchModal({ open, onClose }: Props) {
  const { user } = useAuth(); // Get current user
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = async (query: string) => {
    if (!query) return setUsers([]);
    setLoading(true);

    const { data, error } = await supabase
      .from("users")
      .select(
        "id, first_name, last_name, username, batch, course, department, profile_pic"
      )
      .or(`first_name.ilike.%${query}%,username.ilike.%${query}%`);

    if (error) {
      console.error("Error fetching users:", error);
    } else {
      // Exclude current user from the search results
      const filteredUsers = data?.filter((u) => u.username !== user?.username);
      setUsers(filteredUsers || []);
    }

    setLoading(false);
  };

  const fetchUserDetails = async (userId: string) => {
    setLoading(true);
    setSelectedUser(null);

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", Number(userId))
      .single();

    if (error) {
      console.error("Error fetching user details:", error);
    } else {
      setSelectedUser(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchUsers(search);
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [search]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Card>
        <CardContent>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </div>

          {loading ? (
            <CircularProgress sx={{ display: "block", margin: "10px auto" }} />
          ) : (
            <List>
              {users.map((user) => (
                <ListItem
                  key={user.id}
                  onClick={() => fetchUserDetails(user.id)}
                  sx={{ cursor: "pointer" }}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={user.profile_pic}
                      alt={`${user.first_name} ${user.last_name}`}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${user.first_name} ${user.last_name}`}
                  />
                </ListItem>
              ))}
            </List>
          )}

          {selectedUser && (
            <Card sx={{ mt: 2, p: 2, textAlign: "center" }}>
              <Avatar
                src={selectedUser.profile_pic}
                alt={`${selectedUser.first_name} ${selectedUser.last_name}`}
                sx={{ width: 70, height: 70, mx: "auto" }}
              />
              <Typography variant="h6">{`${selectedUser.first_name} ${selectedUser.last_name}`}</Typography>
              <Typography variant="subtitle2" color="textSecondary">
                {selectedUser.role}
              </Typography>
              <Typography variant="body2">
                Username: {selectedUser.username}
              </Typography>
              <Typography variant="body2">
                Department: {selectedUser.department}
              </Typography>
              <Typography variant="body2">
                Batch: {selectedUser.batch}
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                color="primary"
                onClick={() => {
                  navigate(`/messages/${selectedUser.username}`);
                  onClose(); // Close modal when button is clicked
                }}
              >
                Send Message
              </Button>
            </Card>
          )}
        </CardContent>
      </Card>
    </Dialog>
  );
}
