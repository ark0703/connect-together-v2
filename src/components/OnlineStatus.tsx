import { useEffect, useState } from "react";
import supabase from "../utils/supabase";

export const usePresence = () => {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    const channel = supabase.channel("online-users", {
      config: { presence: { key: "presence" } },
    });

    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      setOnlineUsers(Object.keys(state));
    });

    channel.on("presence", { event: "join" }, ({ key }) => {
      setOnlineUsers((prev) => [...prev, key]);
    });

    channel.on("presence", { event: "leave" }, ({ key }) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== key));
    });

    channel.subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return { onlineUsers };
};
