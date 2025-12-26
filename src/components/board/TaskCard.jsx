import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function TaskCard({ task, setTasks, onEdit }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleCardClick = () => {
    if (onEdit) onEdit(task);
  };

  const deleteTask = (e) => {
    e.stopPropagation();
    setTasks(tasks => tasks.filter(t => t.id !== task.id));
  };

  return (
    <div style={{ marginBottom: 8 }}>
      <div
        ref={setNodeRef}
        style={{
          ...style,
          backgroundColor: '#fff',
          border: '1px solid #ddd',
          borderRadius: 8,
          padding: 12,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          cursor: 'pointer',
        }}
        onClick={handleCardClick}
      >
        <div
          {...attributes}
          {...listeners}
          style={{
            width: '20px',
            height: '20px',
            backgroundColor: '#ddd',
            borderRadius: '50%',
            cursor: 'grab',
            marginBottom: '8px'
          }}
          title="Drag to move"
        />
        <div>
          <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>{task.title}</h4>
          <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>{task.description}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#888' }}>Due: {task.dueDate}</p>
              <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#888' }}>Priority: {task.priority}</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Assigned: {task.assignee}</p>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onEdit) onEdit(task);
                }}
                style={{
                  backgroundColor: '#0079bf',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  padding: '4px 8px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Edit
              </button>
              <button
                onClick={deleteTask}
                style={{
                  backgroundColor: '#ff4757',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  padding: '4px 8px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
