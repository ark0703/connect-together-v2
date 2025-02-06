import { useEffect, useState, useRef } from "react";
import { MessageType, UserType } from "../types/types";
import { useParams, useNavigate } from "react-router";
import supabase from "../utils/supabase";
import { useAuth } from "../contexts/AuthContext";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import moment from "moment";

export default function Messages() {
  const [secondUser, setSecondUser] = useState<UserType | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [message, setMessage] = useState("");
  const { username } = useParams();
  const { user } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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

  const fetchMessages = async () => {
    if (!secondUser || !user) return;

    const { data, error } = await supabase
      .from("message")
      .select("*")
      .or(
        `sent_by.eq.${secondUser.id},sent_to.eq.${user.id},sent_by.eq.${user.id},sent_to.eq.${secondUser.id}`
      )
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return;
    }

    setMessages(data);
    scrollToBottom();
  };

  useEffect(() => {
    fetchMessages();
  }, [secondUser, user]);

  useEffect(() => {
    const subscription = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "message" },
        (payload) => {
          const newMessage = payload.new as MessageType;

          setMessages((prevMessages) => [...prevMessages, newMessage]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !secondUser || !message.trim()) return;

    const { error } = await supabase.from("message").insert([
      {
        message,
        sent_by: user.id,
        sent_to: secondUser.id,
        is_read: false,
      },
    ]);

    if (error) {
      console.error("Error sending message:", error);
      return;
    }

    setMessage("");
  };

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
      <Box
        sx={{
          background: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          padding: 1,
          boxShadow: theme.shadows[2],
          position: "relative",
        }}
      >
        <Container>
          <Box
            sx={{
              display: "flex",
              color: theme.palette.primary.contrastText,
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
        </Container>
      </Box>

      {/* Chat Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Container>
          {messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                display: "flex",
                justifyContent:
                  msg.sent_by === user?.id ? "flex-end" : "flex-start",
                mb: 2,
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
                  maxWidth: "60%",
                  bgcolor:
                    msg.sent_by === user?.id
                      ? theme.palette.primary.main
                      : theme.palette.grey[300],
                  color: msg.sent_by === user?.id ? "white" : "black",
                  alignSelf:
                    msg.sent_by === user?.id ? "flex-end" : "flex-start",
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
          <div ref={messagesEndRef} />
        </Container>
      </Box>

      {/* Message Input */}
      <Container>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 2,
            bgcolor: theme.palette.background.paper,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                // Prevents new lines if Shift+Enter is pressed
                e.preventDefault(); // Prevents adding a new line in the TextField
                sendMessage(e); // Calls the sendMessage function
              }
            }}
            sx={{ flex: 1, mr: 1 }}
          />
          <Button variant="contained" onClick={sendMessage}>
            Send
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
