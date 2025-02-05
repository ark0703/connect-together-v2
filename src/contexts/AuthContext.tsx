import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { UserType } from "../types/types";
import supabase from "../utils/supabase";
import useDebounce from "../hooks/useDebounce";

const AuthContext = createContext<{
  user: UserType | null;
  loading: boolean;
  signOut: () => void;
  isLoggedIn: boolean;
}>({
  user: null,
  loading: true,
  signOut: () => {},
  isLoggedIn: false,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export default function AuthContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const getUser = useDebounce(() => {
    try {
      supabase.auth.getUser().then(async ({ error, data: { user } }) => {
        if (error) {
          console.error(error);
          return;
        }
        if (!user) {
          setUser(null);
          return;
        }

        const { data, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("uuid", user.id)
          .single();

        if (userError) {
          console.error("Error fetching user data:", userError.message);
          return;
        }

        console.log(data);
        setUser(data);

        // Update is_online status when fetching user
        await supabase
          .from("users")
          .update({
            is_online: true,
            last_seen: new Date().toISOString(), // Ensures a recent timestamp
          })
          .eq("uuid", user.id);
      });
    } catch (e) {
      console.error(e);
    }
  });

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setIsLoggedIn(true);
          getUser();
        } else {
          console.log(event);

          setIsLoggedIn(false);
          setUser(null);
        }
      }
    );

    // Check if user is already logged in when the component mounts
    supabase.auth.getUser().then(({ error, data: { user } }) => {
      if (error) {
        console.error("Error fetching user:", error);
      }
      if (user) {
        setIsLoggedIn(true);
        getUser();
      }
      setLoading(false);
    });

    // Cleanup function to prevent memory leaks
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const updateOfflineStatus = async () => {
      if (user) {
        await supabase
          .from("users")
          .update({
            is_online: false,
            last_seen: new Date().toISOString(),
          })
          .eq("uuid", user.uuid);
      }
    };

    window.addEventListener("beforeunload", updateOfflineStatus);

    return () => {
      updateOfflineStatus();
      window.removeEventListener("beforeunload", updateOfflineStatus);
    };
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signOut: async () => {
          if (user) {
            await supabase
              .from("users")
              .update({
                is_online: false,
                last_seen: new Date().toISOString(),
              })
              .eq("uuid", user.uuid);
          }
          await supabase.auth.signOut();
          setUser(null);
          setIsLoggedIn(false);
        },
        isLoggedIn: isLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
