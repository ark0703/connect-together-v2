import { useEffect, useState } from "react";
import { MessageType, MessageUserType, UserType } from "../types/types";
import { useParams } from "react-router";
import supabase from "../utils/supabase";
import { useAuth } from "../contexts/AuthContext";
import { Box, Button, TextField } from "@mui/material";
import moment from "moment";

export default function Messages() {
  const [secondUser, setSecondUser] = useState<UserType | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [message, setMessage] = useState("");

  const { username } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    supabase
      .from("users")
      .select("*")
      .eq("username", username ?? "")
      .single()
      .then(({ data: secondUser, error }) => {
        if (error) {
          console.error(error);
          return;
        }
        setSecondUser(secondUser);
      });
  }, []);

  useEffect(() => {
    if (!secondUser) return;
    if (!user) return;
    supabase
      .from("message")
      .select("*")
      // @ts-ignore
      .or([
        `sent_by.eq.${secondUser.id},sent_to.eq.${user.id}`,
        `sent_by.eq.${user.id},sent_to.eq.${secondUser.id}`,
      ])
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
          return;
        }
        setMessages(data);
      });
  }, [secondUser, user]);

  return (
    <Box>
      {messages.map((message) => (
        <Box key={message.id}>
          <p>{message.message}</p>
          <p>
            {message.sent_by === user?.id
              ? "You"
              : message.sent_by === secondUser?.id
              ? secondUser?.username
              : "Unknown"}{" "}
            {moment(message.created_at).fromNow()}
          </p>
        </Box>
      ))}

      <Box>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button
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
