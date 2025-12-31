// src/components/Header.jsx
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="h-14 bg-slate-900 text-white flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold">Team Task Board</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm">{user?.name}</span>
        <button
          onClick={logout}
          className="bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
