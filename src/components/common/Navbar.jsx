import { useState } from "react";
import ProfileModal from "../auth/ProfileModal";

export default function Navbar() {
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <>
      <nav>
        <button
          onClick={() => setShowProfileModal(true)}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          Profile
        </button>
      </nav>

      {showProfileModal && (
        <ProfileModal onClose={() => setShowProfileModal(false)} />
      )}
    </>
  );
}
