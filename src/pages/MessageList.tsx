import { useEffect, useState } from "react";
import supabase from "../utils/supabase";
import { UserType } from "../types/types";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router";
import ProfileSearchModal from "../Modal/ProfileSearchModal";

export default function MessageList() {
  const [recentMessages, setRecentMessages] = useState<UserType[]>([]);
  const { user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .neq("id", user.id);

      if (error) {
        console.error(error);
      } else {
        setRecentMessages(data);
      }
    };

    fetchUsers();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel("realtime-users")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "users" },
        (payload) => {
          setRecentMessages((prev) =>
            prev.map((msg) =>
              msg.id === payload.new.id ? { ...msg, ...payload.new } : msg
            )
          );
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Recent Messages</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setSearchOpen(true)}
        >
          Search Users
        </Button>
      </Box>
      <Card>
        <CardContent>
          <List>
            {recentMessages.map((message) => (
              <ListItem
                key={`message-${message.id}`}
                component={Link}
                to={`/messages/${message.username}`}
              >
                <ListItemAvatar>
                  <Avatar
                    src={message.profile_pic || undefined}
                    alt={`${message.first_name} ${message.last_name}`}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      fontWeight={600}
                    >{`${message.first_name} ${message.last_name}`}</Typography>
                  }
                  secondary={`@${message.username}`}
                />
                <Box textAlign="right">
                  <Typography variant="body2" color="textSecondary">
                    {message.course}
                  </Typography>
                  {message.is_online ? (
                    <Typography sx={{ color: "green" }}>● Online</Typography>
                  ) : (
                    <Typography sx={{ color: "gray" }}>
                      Last seen{" "}
                      {message.last_seen
                        ? new Date(message.last_seen).toLocaleString()
                        : "Unknown"}
                    </Typography>
                  )}
                </Box>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
      <ProfileSearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </Box>
  );
}
