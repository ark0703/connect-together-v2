import { useEffect, useState } from "react";
import { MessageType, UserType } from "../types/types";
import { useParams, useNavigate } from "react-router";
import supabase from "../utils/supabase";
import { useAuth } from "../contexts/AuthContext";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import moment from "moment";
import { useSupabaseLiveListener } from "../contexts/SupabaseLiveListener";

export default function Messages() {
  const [secondUser, setSecondUser] = useState<UserType | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [message, setMessage] = useState("");
  const { username } = useParams();
  const { user } = useAuth();
  const { events, setEvents } = useSupabaseLiveListener();
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (!username) return;
    supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching second user:", error);
          return;
        }
        setSecondUser(data);
      });
  }, [username]);

  const getData = () => {
    if (!secondUser || !user) return;
    supabase
      .from("message")
      .select("*")
      .or(
        `sent_by.eq.${secondUser.id},sent_to.eq.${user.id},sent_by.eq.${user.id},sent_to.eq.${secondUser.id}`
      )
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
          return;
        }
        setMessages(data);
      });
  };

  useEffect(() => {
    getData();
  }, [secondUser, user]);

  useEffect(() => {
    if (events === "insert-message") {
      getData();
      setEvents("");
    }
  }, [events]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        bgcolor: theme.palette.background.default,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          boxShadow: theme.shadows[2],
          width: "100%",
        }}
      >
        <IconButton onClick={() => navigate(-1)} sx={{ color: "white" }}>
          <ArrowBackIcon />
        </IconButton>
        {secondUser ? (
          <>
            <Avatar
              src={secondUser.profile_pic || undefined}
              alt={secondUser.username}
              sx={{ width: 40, height: 40, ml: 1 }}
            />
            <Box sx={{ ml: 2 }}>
              <Typography variant="h6">
                {secondUser.first_name} {secondUser.last_name}
              </Typography>
              <Typography variant="body2" sx={{ color: "lightgray" }}>
                {secondUser.is_online
                  ? "● Online"
                  : `Last seen ${moment(secondUser.last_seen).fromNow()}`}
              </Typography>
            </Box>
          </>
        ) : (
          <CircularProgress color="inherit" size={24} sx={{ ml: 2 }} />
        )}
      </Box>

      {/* Chat Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        {messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              display: "flex",
              justifyContent:
                msg.sent_by === user?.id ? "flex-end" : "flex-start",
              mb: 2,
              width: "100%",
            }}
          >
            {msg.sent_by !== user?.id && (
              <Avatar
                src={secondUser?.profile_pic || undefined}
                alt={secondUser?.username}
                sx={{ width: 32, height: 32, mr: 1 }}
              />
            )}
            <Paper
              sx={{
                p: 1.5,
                borderRadius: 2,
                maxWidth: "40%",
                bgcolor:
                  msg.sent_by === user?.id
                    ? theme.palette.primary.main
                    : theme.palette.grey[300],
                color: msg.sent_by === user?.id ? "white" : "black",
                alignSelf: msg.sent_by === user?.id ? "flex-end" : "flex-start",
              }}
            >
              <Typography>{msg.message}</Typography>
              <Typography
                variant="caption"
                sx={{ display: "block", textAlign: "right", opacity: 0.7 }}
              >
                {moment(msg.created_at).format("hh:mm A")}
              </Typography>
            </Paper>
          </Box>
        ))}
      </Box>

      {/* Message Input */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          bgcolor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`,
          width: "100%",
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          sx={{ flex: 1, mr: 1 }}
        />
        <Button
          variant="contained"
          onClick={(e) => {
            e.preventDefault();
            if (!user) {
              console.error("User not logged in");
              return;
            }
            if (!secondUser) {
              console.error("Second user not found");
              return;
            }
            supabase
              .from("message")
              .insert([
                {
                  message,
                  sent_by: user.id,
                  sent_to: secondUser.id,
                },
              ])
              .then(({ error }) => {
                if (error) {
                  console.error(error);
                  return;
                }
                setMessage("");
                console.log("Message sent");
              });
          }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
}
