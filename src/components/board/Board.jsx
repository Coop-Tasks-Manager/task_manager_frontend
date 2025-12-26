import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import Column from "./Column";

const statuses = ["To Do", "In Progress", "Done"];

export default function Board({ tasks, setTasks, onEdit }) {
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Find the task being dragged
    const activeTask = tasks.find(task => task.id === activeId);
    if (!activeTask) return;

    // If dropping on a column (not another task)
    if (statuses.includes(overId)) {
      const newStatus = overId;
      if (activeTask.status !== newStatus) {
        setTasks(tasks =>
          tasks.map(t => t.id === activeId ? { ...t, status: newStatus } : t)
        );
      }
      return;
    }

    // If dropping on another task, reorder within the same column
    const overTask = tasks.find(task => task.id === overId);
    if (!overTask || activeTask.status !== overTask.status) return;

    const columnTasks = tasks.filter(t => t.status === activeTask.status);
    const activeIndex = columnTasks.findIndex(t => t.id === activeId);
    const overIndex = columnTasks.findIndex(t => t.id === overId);

    if (activeIndex !== overIndex) {
      const reorderedTasks = arrayMove(columnTasks, activeIndex, overIndex);
      const otherTasks = tasks.filter(t => t.status !== activeTask.status);
      setTasks([...otherTasks, ...reorderedTasks]);
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div style={{ display: "flex", gap: 20, padding: 20, minHeight: '80vh' }}>
        {statuses.map(status => (
          <Column
            key={status}
            status={status}
            tasks={tasks}
            setTasks={setTasks}
            onEdit={onEdit}
          />
        ))}
      </div>
    </DndContext>
  );
}
