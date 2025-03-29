import { Routes, Route } from "react-router";
import Home from "../pages/Home";
import { useAuth } from "../contexts/AuthContext";
import Login from "../pages/Login";
import Register from "../pages/Register";
import CreateUserProfile from "../pages/CreateUserProfile";
import MessageList from "../pages/MessageList";
import Messages from "../pages/Messages";
import ForgetPassword from "./ForgetPassword";
import UpdatePassword from "./UpdatePassword";
import Contact from "../pages/Contact";
import About from "../pages/About";
import EventJobFeed from "../pages/EventJobFeed";
export default function Router() {
  const { isLoggedIn, user } = useAuth();
  console.log(isLoggedIn, user);
  return (
    <Routes>
      {isLoggedIn && (!user || !user.first_name || !user.uuid) && (
        <>
          <Route path="*" element={<CreateUserProfile />} />
          <Route path="/update-password" element={<UpdatePassword />} />
        </>
      )}

      {isLoggedIn && user && (
        <>
          <Route path="*" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/:type" element={<EventJobFeed />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/messages" element={<MessageList />} />
          <Route path="/messages/:username" element={<Messages />} />
          <Route path="/profile" element={<CreateUserProfile />} />
          <Route path="/update-password" element={<UpdatePassword />} />
        </>
      )}
      {!isLoggedIn ? (
        <>
          <Route path="*" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
        </>
      ) : null}
    </Routes>
  );
}
