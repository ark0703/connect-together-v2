import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { UserType } from "../types/types";
import supabase from "../utils/supabase";

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

  const getUser = () => {
    supabase
      .from("users")
      .select("*")
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
          return;
        }
        setUser(data);
      });
  };

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        // If user is logged in, get user profile
        getUser();
      } else {
        // If user is not logged in, set user to null
        setUser(null);
      }
    });

    supabase.auth.getUser().then((user) => {
      if (user) {
        getUser();
      }
      setLoading(false);
    });

    // If user is logged in, setUser
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signOut: () => {
          supabase.auth.signOut();
        },
        isLoggedIn: user !== null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
