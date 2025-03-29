import { useEffect, useState, useMemo } from "react";
import supabase from "../utils/supabase";
import { UserType, MessageType, MessageUserType } from "../types/types";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
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
  const [recentMessages, setRecentMessages] = useState<
    (UserType & { latestMessage?: MessageType })[]
  >([]);
  const { user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchUsersWithMessages = async () => {
      // Fetch messages where the logged-in user is either sender or receiver
      const { data: messages, error: messageError } = await supabase
        .from("message")
        .select("*")
        .or(`sent_by.eq.${user.username},sent_to.eq.${user.username}`)
        .order("created_at", { ascending: false });

      if (messageError) {
        console.error(messageError);
        return;
      }

      // Extract unique usernames that the user has messaged
      const contactedUsernames = new Set<string>();
      messages.forEach((msg) => {
        if (msg.sent_by !== user.username) {
          contactedUsernames.add(msg.sent_by);
        }
        if (msg.sent_to !== user.username) {
          contactedUsernames.add(msg.sent_to);
        }
      });

      if (contactedUsernames.size === 0) {
        setRecentMessages([]); // If no messages, clear the state
        return;
      }

      // Fetch only those users that have been contacted
      const { data: users, error: userError } = await supabase
        .from("users")
        .select("*")
        .in("username", Array.from(contactedUsernames)); // Filter users by usernames

      if (userError) {
        console.error(userError);
        return;
      }

      // Merge latest message data with user info
      const usersWithMessages = users.map((u) => {
        const latestMessage = messages.find(
          (m) => m.sent_by === u.username || m.sent_to === u.username
        );
        return { ...u, latestMessage };
      });

      setRecentMessages(usersWithMessages);
    };

    fetchUsersWithMessages();

    // Subscribe to real-time message updates
    const messageSubscription = supabase
      .channel("realtime-messages")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "message" },
        (payload) => {
          const newMessage = payload.new as MessageUserType;

          setRecentMessages((prev) => {
            let found = false;
            const updatedMessages = prev.map((user) => {
              if (
                user.username === newMessage.sent_by ||
                user.username === newMessage.sent_to
              ) {
                found = true;
                return { ...user, latestMessage: newMessage };
              }
              return user;
            });

            // If message is from a new user, add them to the list
            if (!found) {
              return [
                ...updatedMessages,
                {
                  ...newMessage.user_id,
                  latestMessage: newMessage,
                } as UserType & {
                  latestMessage?: MessageUserType;
                },
              ];
            }

            return updatedMessages;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messageSubscription);
    };
  }, [user]);

  // Memoized sorting function for better reactivity
  const sortedMessages = useMemo(() => {
    return [...recentMessages].sort((a, b) => {
      const unreadA = a.latestMessage && !a.latestMessage.is_read;
      const unreadB = b.latestMessage && !b.latestMessage.is_read;

      if (unreadA && !unreadB) return -1;
      if (!unreadA && unreadB) return 1;

      return (
        new Date(b.latestMessage?.created_at || 0).getTime() -
        new Date(a.latestMessage?.created_at || 0).getTime()
      );
    });
  }, [recentMessages]);

  return (
    <Container>
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
              {sortedMessages.map((messageUser, index) => {
                const latestMessage = messageUser.latestMessage;
                const isUnread = latestMessage && !latestMessage.is_read;

                return (
                  <div key={`message-${messageUser.id}`}>
                    <ListItem
                      component={Link}
                      to={`/messages/${messageUser.username}`}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={messageUser.profile_pic || undefined}
                          alt={`${messageUser.first_name} ${messageUser.last_name}`}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography
                            fontWeight={600}
                            sx={{
                              color: isUnread ? "primary.main" : "text.primary",
                            }}
                          >
                            {`${messageUser.first_name} ${messageUser.last_name}`}
                          </Typography>
                        }
                        secondary={
                          latestMessage
                            ? latestMessage.message.length > 40
                              ? latestMessage.message.slice(0, 40) + "..."
                              : latestMessage.message
                            : "No messages yet"
                        }
                      />
                      <Box textAlign="right">
                        <Typography variant="body2" color="textSecondary">
                          {messageUser.course}
                        </Typography>
                        {messageUser.is_online ? (
                          <Typography sx={{ color: "green" }}>
                            ● Online
                          </Typography>
                        ) : (
                          <Typography sx={{ color: "gray" }}>
                            Last seen{" "}
                            {messageUser.last_seen
                              ? new Date(messageUser.last_seen).toLocaleString()
                              : "Unknown"}
                          </Typography>
                        )}
                      </Box>
                    </ListItem>
                    {index !== sortedMessages.length - 1 && <Divider />}
                  </div>
                );
              })}
            </List>
          </CardContent>
        </Card>
        <ProfileSearchModal
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
        />
      </Box>
    </Container>
  );
}
