import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from "./TaskCard";

export default function Column({ status, tasks, setTasks, onEdit }) {
  const filtered = tasks.filter(t => t.status === status);
  const taskIds = filtered.map(t => t.id);

  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        width: 300,
        minHeight: 500,
        backgroundColor: isOver ? '#f0f0f0' : '#f5f5f5',
        borderRadius: 8,
        padding: 16,
        border: '2px dashed #ddd'
      }}
    >
      <h3 style={{ marginBottom: 16, color: '#333' }}>{status}</h3>
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        {filtered.map(task => (
          <TaskCard key={task.id} task={task} setTasks={setTasks} onEdit={onEdit} />
        ))}
      </SortableContext>
    </div>
  );
}
