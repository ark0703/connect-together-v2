import { Box, Container } from "@mui/material";
import Router from "./components/Router";
import { useAuth } from "./contexts/AuthContext";
import LinearLoader from "./components/LinearLoader";
import FloatingMessageButton from "./components/PagesComponent/FloatingMessageButton";
import Navbar from "./components/PagesComponent/Navbar";
import { useLocation } from "react-router";

export default function App() {
  const { loading, user } = useAuth();
  const location = useLocation(); // Get current route

  if (loading) {
    return (
      <Box height="100vh" width="100vw">
        <LinearLoader />
      </Box>
    );
  }

  // Hide Navbar & Floating Message Button on /messages and its subroutes
  const hideComponents = /^\/messages\/[^/]+$/.test(location.pathname);

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      {user && !hideComponents && <Navbar />}
      <Router />
      {user && !hideComponents && <FloatingMessageButton />}
    </Box>
  );
}
