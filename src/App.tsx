import { Box, Container } from "@mui/material";
import Router from "./components/Router";
import { useAuth } from "./contexts/AuthContext";
import LinearLoader from "./components/LinearLoader";
import FloatingMessageButton from "./components/PagesComponent/FloatingMessageButton";
import Navbar from "./components/PagesComponent/Navbar";
import React from "react";

export default function App() {
  const { loading, user } = useAuth();
  const containerRef = React.useRef<HTMLDivElement>(null);

  if (loading) {
    return (
      <Box height="100vh" width="100vw">
        <LinearLoader />
      </Box>
    );
  }

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <Container
        ref={containerRef}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        {user && !/^\/messages\/[^/]+$/.test(window.location.pathname) && (
          <Navbar />
        )}
        <Router />
      </Container>

      {user && !/^\/messages\/[^/]+$/.test(window.location.pathname) && (
        <FloatingMessageButton />
      )}
    </Box>
  );
}
