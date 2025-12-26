import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import BoardsPage from "./pages/BoardsPage";
import BoardPage from "./pages/BoardPage";
import Navbar from "./components/common/Navbar";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { user   } = useAuth();

  return (
    <BrowserRouter>
      {user && Navbar}
      <Routes>
        <Route path="/" element={user ? <Navigate to="/boards" /> : <Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/boards" element={<BoardsPage />} />
        <Route path="/board/:id" element={<BoardPage />} />
      </Routes>
    </BrowserRouter>
  );
}
