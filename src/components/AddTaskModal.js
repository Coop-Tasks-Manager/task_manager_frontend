import { useState } from "react";
import api from "../services/api";

export default function AddTaskModal({ boardId, onClose, onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/tasks/${boardId}`, {
        title,
        description,
        priority,
        due_date: dueDate,
      });
      onTaskCreated(res.data);
      onClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px", width: "400px" }}>
        <h3>Create Task</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", marginBottom: "10px" }}
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "100%", marginBottom: "10px" }}
          />
          <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ width: "100%", marginBottom: "10px" }}>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={{ width: "100%", marginBottom: "10px" }}
          />
          <button type="submit" style={{ width: "100%", marginBottom: "10px" }}>Create</button>
          <button type="button" onClick={onClose} style={{ width: "100%" }}>Cancel</button>
        </form>
      </div>
    </div>
  );
}
