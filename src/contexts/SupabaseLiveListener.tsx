import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../utils/supabase";

const SupabaseLiveListenerContext = createContext<{
  events: string;
  setEvents: (events: string) => void;
}>({
  events: "",
  setEvents: () => {},
});

export const useSupabaseLiveListener = () => {
  return useContext(SupabaseLiveListenerContext);
};

export default function SupabaseLiveListener({
  children,
}: {
  children: React.ReactNode;
}) {
  const [events, setEvents] = useState("");

  useEffect(() => {
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
        },
        (payload) => {
          setEvents(
            payload.eventType.toLowerCase() + "-" + payload.table.toLowerCase()
          );
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <SupabaseLiveListenerContext.Provider
      value={{
        events,
        setEvents,
      }}
    >
      {children}
    </SupabaseLiveListenerContext.Provider>
  );
}
