import { Box } from "@mui/material";
import Router from "./components/Router";
import { useAuth } from "./contexts/AuthContext";
import LinearLoader from "./components/LinearLoader";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <Box height={"100dvh"} width={"100dvw"}>
        <LinearLoader />
      </Box>
    );
  }
  return (
    <Box maxWidth="96rem" margin={"0 auto"}>
      <Router />
    </Box>
  );
}

export default App;
