// src/components/TaskCard.jsx
export default function TaskCard({ task }) {
  return (
    <div className="bg-white p-3 rounded shadow hover:shadow-md transition">
      <h4 className="font-medium text-sm">{task.title}</h4>
      <p className="text-xs text-gray-600 mt-1">{task.description}</p>
      <div className="flex justify-between items-center mt-3">
        <span className="text-xs px-2 py-1 bg-blue-100 rounded">{task.priority}</span>
        {task.assigned_to && <span className="text-xs text-gray-500">👤 {task.assigned_to}</span>}
      </div>
    </div>
  );
}
