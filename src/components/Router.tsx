import { Routes, Route } from "react-router";
import Home from "../pages/Home";
import { useAuth } from "../contexts/AuthContext";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import CreateUserProfile from "../pages/CreateUserProfile";
import MessageList from "../pages/MessageList";
import Messages from "../pages/Messages";

export default function Router() {
  const { isLoggedIn, user } = useAuth();
  console.log(isLoggedIn, user);
  return (
    <Routes>
      {isLoggedIn && !user && (
        <Route path="*" element={<CreateUserProfile />} />
      )}
      {isLoggedIn && user && (
        <>
          <Route path="/" element={<Home />} />
          <Route path="/messages" element={<MessageList />} />
          <Route path="/messages/:username" element={<Messages />} />
        </>
      )}
      {!isLoggedIn && (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </>
      )}
      <Route path="*" element={<h1>Not Found</h1>} />
    </Routes>
  );
}
