import { createContext, useContext, useState } from "react";

const BoardContext = createContext();

export function BoardProvider({ children }) {
  const [boards, setBoards] = useState([
    { id: 1, name: "Backend Development" },
    { id: 2, name: "DevOps and Deployment" },
    { id: 3, name: "Frontend Development" }
  ]);

  const [tasks, setTasks] = useState([
    {
      id: 1,
      boardId: 1,
      title: "Backend Development",
      description: " Implement user authentication and authorization",
      status: "In Progress",
      priority: "High",
      assignee: "AIMEE",
      dueDate: "2024-01-15"
    },
    {
      id: 2,
      boardId: 1,
      title: "DevOps and Deployment",
      description: "Configure automated testing and deployment",
      status: "To Do",
      priority: "Medium",
      assignee: "HERMANE",
      dueDate: "2024-01-20"
    },
    {
      id: 3,
      boardId: 2,
      title: "Frontend Development",
      description: "Design graphics for TASKS MANAGEMENT ",
      status: "Done",
      priority: "Low",
      assignee: "AYANDA",
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
