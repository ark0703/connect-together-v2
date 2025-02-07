import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { UserType, SupabaseUserType } from "../types/types";
import supabase from "../utils/supabase";
import useDebounce from "../hooks/useDebounce";

const AuthContext = createContext<{
  user: UserType | null;
  sb_user: SupabaseUserType | null;
  loading: boolean;
  signOut: () => void;
  isLoggedIn: boolean;
}>({
  user: null,
  sb_user: null,
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
  const [sb_user, setSbUser] = useState<SupabaseUserType | null>(null);
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
          setSbUser(null);
          return;
        }
        setSbUser(user as SupabaseUserType); // Store the Supabase user

        const { data, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("uuid", user.id)
          .single();

        if (userError) {
          console.warn(
            "No users table found or error fetching user data:",
            userError.message
          );
          return;
        }

        setUser(data);

        // Update is_online status when fetching user
        await supabase
          .from("users")
          .update({
            is_online: true,
            last_seen: new Date().toISOString(),
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
          setIsLoggedIn(false);
          setUser(null);
          setSbUser(null);
        }
      }
    );

    supabase.auth.getUser().then(({ error, data: { user } }) => {
      if (error) {
        console.error("Error fetching user:", error);
      }
      if (user) {
        setIsLoggedIn(true);
        setSbUser(user as SupabaseUserType);
        getUser();
      }
      setLoading(false);
    });

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
        sb_user,
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
          setSbUser(null);
          setIsLoggedIn(false);
        },
        isLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
