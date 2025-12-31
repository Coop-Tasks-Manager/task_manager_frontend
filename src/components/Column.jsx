// src/components/Column.jsx
import TaskCard from "./TaskCard";

export default function Column({ status, tasks }) {
  return (
    <div className="w-72 bg-slate-200 rounded-lg p-3 flex-shrink-0">
      <h3 className="font-semibold mb-3">{status}</h3>
      <div className="space-y-3">
        {tasks.map(task => <TaskCard key={task.id} task={task} />)}
      </div>
    </div>
  );
}
