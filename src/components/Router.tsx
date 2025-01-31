import { Routes, Route } from "react-router";
import Home from "../pages/Home";
import { useAuth } from "../contexts/AuthContext";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";

export default function Router() {
  const { user, isLoggedIn } = useAuth();
  return (
    <Routes>
      <Route path="/" element={user ? <Home /> : <Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/profile"
        element={isLoggedIn && user?.first_name ? <Profile /> : <Home />}
      />
      <Route path="*" element={<h1>Not Found</h1>} />
    </Routes>
  );
}
