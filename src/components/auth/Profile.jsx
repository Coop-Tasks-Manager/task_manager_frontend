import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h2>Profile</h2>
      <p>{user?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
