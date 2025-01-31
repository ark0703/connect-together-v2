import { useEffect, useState } from "react";
import supabase from "../utils/supabase";
import { UserType } from "../types/types";
import { Box, Typography } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router";

export default function MessageList() {
  const [recentMessages, setRecentMessages] = useState<UserType[]>([]);

  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    supabase
      .from("users")
      .select("*")
      .neq("id", user?.id)
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
          return;
        }
        setRecentMessages(data);
      });
  }, [user]);

  return (
    <Box>
      <Typography variant="h1">Recent Messages</Typography>
      {recentMessages.map((message) => (
        <Link
          to={"/messages/" + message.username}
          key={`message-${message.id}`}
        >
          <p>{message.username}</p>
        </Link>
      ))}
    </Box>
  );
}
