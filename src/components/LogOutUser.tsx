import { useEffect } from "react";
import { useNavigate } from "react-router";
import supabase from "../utils/supabase";

const LogOutUser = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logOut = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error logging out:", error.message);
        return;
      }
      console.log("Logged out");
      navigate("/login"); // Redirect after logout
    };

    logOut();
  }, [navigate]); // ✅ Run only once when component mounts

  return null; // This component doesn't render anything
};

export default LogOutUser;
