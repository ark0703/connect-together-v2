import { Routes, Route } from "react-router";
import Home from "../pages/Home";
import { useAuth } from "../contexts/AuthContext";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import CreateUserProfile from "../pages/CreateUserProfile";

export default function Router() {
  const { isLoggedIn, user } = useAuth();
  return (
    <Routes>
      {isLoggedIn && !user && (
        <Route path="*" element={<CreateUserProfile />} />
      )}
      {isLoggedIn && user && (
        <>
          <Route path="/" element={isLoggedIn ? <Home /> : <Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="*" element={<h1>Not Found</h1>} />
        </>
      )}
    </Routes>
  );
}
