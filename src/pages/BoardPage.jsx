import { useState } from "react";
import Board from "../components/board/Board";
import TaskForm from "../components/board/TaskForm";
import Modal from "../components/common/Modal";
import { useBoard } from "../context/BoardContext";

export default function BoardPage({ boardId, boardName }) {
  const { tasks, setTasks } = useBoard();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Filter tasks for this board
  const boardTasks = tasks.filter(task => task.boardId === boardId);
  const setBoardTasks = (updater) => {
    // Handle both function and array cases
    if (typeof updater === 'function') {
      // updater is a function like (prevTasks) => newTasks
      setTasks(allTasks => {
        const currentBoardTasks = allTasks.filter(task => task.boardId === boardId);
        const newBoardTasks = updater(currentBoardTasks);
        const otherTasks = allTasks.filter(task => task.boardId !== boardId);
        return [...otherTasks, ...newBoardTasks.map(task => ({ ...task, boardId }))];
      });
    } else {
      // updater is an array of new tasks
      const otherTasks = tasks.filter(task => task.boardId !== boardId);
      setTasks([...otherTasks, ...updater.map(task => ({ ...task, boardId }))]);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingTask(null);
  };

  return (
    <div style={{
      backgroundColor: '#f4f5f7',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: '16px 20px',
        marginBottom: 20,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{ margin: 0, color: '#333' }}>{boardName}</h2>
        <button
          onClick={() => setShowTaskModal(true)}
          style={{
            backgroundColor: '#0079bf',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            padding: '8px 16px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          + Add Task
        </button>
      </div>

      <Board tasks={boardTasks} setTasks={setBoardTasks} onEdit={handleEditTask} />

      {/* Task Modal */}
      {showTaskModal && (
        <Modal onClose={() => setShowTaskModal(false)}>
          <TaskForm
            setTasks={setBoardTasks}
            onClose={() => setShowTaskModal(false)}
            isModal={true}
          />
        </Modal>
      )}

      {/* Edit Task Modal */}
      {showEditModal && editingTask && (
        <Modal onClose={closeEditModal}>
          <TaskForm
            task={editingTask}
            setTasks={setBoardTasks}
            onClose={closeEditModal}
            isModal={true}
          />
        </Modal>
      )}
    </div>
  );
}
