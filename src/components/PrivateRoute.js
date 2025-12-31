import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>; // wait for auth check

  if (!user) return <Navigate to="/login" />; // redirect if not logged in

  return children; // render protected content
}
