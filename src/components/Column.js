export default function Column({ task }) {
  return (
    <div style={{
      border: "1px solid #999",
      borderRadius: "6px",
      padding: "10px",
      marginBottom: "10px",
      backgroundColor: "#fff"
    }}>
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <small>Priority: {task.priority}</small><br/>
      <small>Assigned: {task.assigned_to || "Unassigned"}</small><br/>
      <small>Due: {new Date(task.due_date).toLocaleDateString()}</small>
    </div>
  );
}
