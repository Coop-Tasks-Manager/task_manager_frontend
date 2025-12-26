import { createContext, useContext, useState } from "react";

const BoardContext = createContext();

export function BoardProvider({ children }) {
  const [boards, setBoards] = useState([
    { id: 1, name: "Project Alpha" },
    { id: 2, name: "Marketing Campaign" },
    { id: 3, name: "Development Tasks" }
  ]);

  const [tasks, setTasks] = useState([
    {
      id: 1,
      boardId: 1,
      title: "Design homepage mockup",
      description: "Create wireframes and mockups for the new homepage",
      status: "In Progress",
      priority: "High",
      assignee: "John Doe",
      dueDate: "2024-01-15"
    },
    {
      id: 2,
      boardId: 1,
      title: "Setup CI/CD pipeline",
      description: "Configure automated testing and deployment",
      status: "To Do",
      priority: "Medium",
      assignee: "Jane Smith",
      dueDate: "2024-01-20"
    },
    {
      id: 3,
      boardId: 2,
      title: "Create social media content",
      description: "Design graphics for Instagram and Facebook",
      status: "Done",
      priority: "Low",
      assignee: "Bob Johnson",
      dueDate: "2024-01-10"
    }
  ]);

  return (
    <BoardContext.Provider value={{ boards, setBoards, tasks, setTasks }}>
      {children}
    </BoardContext.Provider>
  );
}

export const useBoard = () => useContext(BoardContext);
