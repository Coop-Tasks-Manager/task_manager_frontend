import { useAuth } from "../../context/AuthContext";
import Modal from "../common/Modal";

export default function ProfileModal({ onClose }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ marginBottom: '20px', color: '#333' }}>Profile</h2>

        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: '#0079bf',
          color: 'white',
          fontSize: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          👤
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#555' }}>Email</h3>
          <p style={{
            fontSize: '16px',
            color: '#333',
            backgroundColor: '#f8f9fa',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}>
            {user?.email || 'No email available'}
          </p>
        </div>

        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#ff4757',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '12px 24px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#ff3742'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#ff4757'}
        >
          Logout
        </button>
      </div>
    </Modal>
  );
}