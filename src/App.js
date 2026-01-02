import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Teams from "./pages/Teams";      // This acts as your "Teams Dashboard"
import Boards from "./pages/Boards";    // This shows boards for a specific team
//import BoardView from "./pages/BoardView"; // This is the Kanban/Task view
import Dash from "./pages/Dashboard";   // General stats/Overview if needed
import Settings from './pages/Settings'; // Import the file you just created

// Components
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00b274]"></div>
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        {/* --- Public Routes --- */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Register />}
        />

        {/* --- Protected Routes --- */}
        
        {/* 1. Main Dashboard: Lists all Teams user belongs to */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Teams /> 
            </PrivateRoute>
          }
        />

        {/* 2. Team View: Shows the boards within a specific Team */}
        <Route
          path="/teams/:teamId/boards"
          element={
            <PrivateRoute>
              <Boards />
            </PrivateRoute>
          }
        />

        {/* 3. Board View: The Kanban view with tasks (Role-aware) */}
        <Route
          path="/boards/:boardId"
          element={
            <PrivateRoute>
              <Dash />
            </PrivateRoute>
          }
        />

        {/* 4. Personal Dashboard: Optional overview of all user tasks */}
        <Route
          path="/dashboard/:boardId?"
          element={
            <PrivateRoute>
              <Dash />
            </PrivateRoute>
          }
        />

        <Route path="/settings" element={<Settings />} />

        <Route path="/register" element={<Register />} />


        {/* Catch-all redirect to root */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
