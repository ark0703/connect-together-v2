import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { CssBaseline } from "@mui/material";
import AuthContextProvider from "./contexts/AuthContext.tsx";
import SupabaseLiveListener from "./contexts/SupabaseLiveListener.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CssBaseline />
    <SupabaseLiveListener>
      <AuthContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthContextProvider>
    </SupabaseLiveListener>
  </StrictMode>
);
