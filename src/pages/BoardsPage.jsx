import { useState } from "react";
//import { Link } from "react-router-dom";
import BoardPage from "./BoardPage";
import Modal from "../components/common/Modal";
import ProfileModal from "../components/auth/ProfileModal";
import { useBoard } from "../context/BoardContext";

export default function BoardsPage() {
  const { boards, setBoards } = useBoard();
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [showNewBoardModal, setShowNewBoardModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");

  const addBoard = () => {
    if (newBoardName.trim()) {
      setBoards([...boards, { id: Date.now(), name: newBoardName.trim() }]);
      setNewBoardName("");
      setShowNewBoardModal(false);
    }
  };

  const selectedBoard = boards.find(b => b.id === selectedBoardId);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f5f7' }}>
      {/* Sidebar */}
      <div style={{
        width: '300px',
        backgroundColor: '#fff',
        borderRight: '1px solid #ddd',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Profile Circle */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '20px'
        }}>
          <button
            onClick={() => setShowProfileModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#0079bf',
              color: 'white',
              border: 'none',
              fontSize: '24px',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            👤
          </button>
        </div>

        <h2 style={{ marginBottom: '20px', color: '#333' }}>Your Boards</h2>

        <button
          onClick={() => setShowNewBoardModal(true)}
          style={{
            backgroundColor: '#0079bf',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            padding: '10px 16px',
            cursor: 'pointer',
            marginBottom: '20px',
            fontSize: '14px'
          }}
        >
          + New Board
        </button>

        <div style={{ flex: 1 }}>
          {boards.map(board => (
            <div
              key={board.id}
              onClick={() => setSelectedBoardId(board.id)}
              style={{
                padding: '12px 16px',
                marginBottom: '8px',
                backgroundColor: selectedBoardId === board.id ? '#e4f0f6' : '#f5f5f5',
                borderRadius: 4,
                cursor: 'pointer',
                border: selectedBoardId === board.id ? '2px solid #0079bf' : '1px solid #ddd'
              }}
            >
              {board.name}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '20px' }}>
        {selectedBoard ? (
          <BoardPage boardId={selectedBoardId} boardName={selectedBoard.name} />
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '80vh',
            color: '#666'
          }}>
            <div style={{ textAlign: 'center' }}>
              <h3>Select a board from the sidebar</h3>
              <p>Or create a new board to get started</p>
            </div>
          </div>
        )}
      </div>

      {/* New Board Modal */}
      {showNewBoardModal && (
        <Modal onClose={() => setShowNewBoardModal(false)}>
          <h3>Create New Board</h3>
          <input
            type="text"
            placeholder="Board name"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: 4,
              marginBottom: '16px',
              fontSize: '14px'
            }}
            onKeyPress={(e) => e.key === 'Enter' && addBoard()}
            autoFocus
          />
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setShowNewBoardModal(false)}
              style={{
                backgroundColor: 'transparent',
                color: '#666',
                border: '1px solid #ddd',
                borderRadius: 4,
                padding: '8px 16px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={addBoard}
              style={{
                backgroundColor: '#0079bf',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                padding: '8px 16px',
                cursor: 'pointer'
              }}
            >
              Create
            </button>
          </div>
        </Modal>
      )}

      {showProfileModal && (
        <ProfileModal onClose={() => setShowProfileModal(false)} />
      )}
    </div>
  );
}
