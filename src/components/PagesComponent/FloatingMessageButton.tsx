import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { Badge, Fab, Tooltip } from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";

const FloatingMessageButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hasUnread, setHasUnread] = useState<boolean>(true);

  useEffect(() => {
    if (location.pathname === "/messages") {
      setHasUnread(false);
    }
  }, [location.pathname]);

  if (location.pathname === "/messages") {
    return null;
  }
// 
  return (
    <Tooltip title="Messages">
      <Fab
        color="primary"
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
        onClick={() => navigate("/messages")} // Navigate instead of opening modal
      >
        <Badge color="error" variant="dot" invisible={!hasUnread}>
          <MessageIcon />
        </Badge>
      </Fab>
    </Tooltip>
  );
};

export default FloatingMessageButton;
