import { useState, useEffect } from "react";

const assignees = ["HERMANE", "ANGE", "AIMEE", "AYANDA"];

export default function TaskForm({ setTasks, onClose, isModal = false, task: editTask = null }) {
  const [task, setTask] = useState(editTask || {
    title: "",
    description: "",
    dueDate: "",
    priority: "Low",
    assignee: "",
    status: "To Do"
  });

  const [isOpen, setIsOpen] = useState(!isModal);

  useEffect(() => {
    if (editTask) {
      setTask(editTask);
    }
  }, [editTask]);

  const submit = () => {
    if (task.title.trim()) {
      if (editTask) {
        // Edit mode
        setTasks(tasks => tasks.map(t => t.id === editTask.id ? task : t));
      } else {
        // Create mode
        setTasks(prev => [...prev, { ...task, id: Date.now() }]);
      }

      if (!editTask) {
        setTask({
          title: "",
          description: "",
          dueDate: "",
          priority: "Low",
          assignee: "",
          status: "To Do"
        });
      }

      if (isModal) {
        onClose();
      } else {
        setIsOpen(false);
      }
    }
  };

  const cancel = () => {
    if (!editTask) {
      setTask({
        title: "",
        description: "",
        dueDate: "",
        priority: "Low",
        assignee: "",
        status: "To Do"
      });
    }
    if (isModal) {
      onClose();
    } else {
      setIsOpen(false);
    }
  };

  if (isModal) {
    return (
      <div>
        <h3 style={{ marginBottom: '16px', color: '#333' }}>
          {editTask ? 'Edit Task' : 'Create New Task'}
        </h3>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#666' }}>Title *</label>
          <input
            placeholder="Enter a title for this card..."
            value={task.title}
            onChange={e => setTask({...task, title: e.target.value})}
            style={{
              width: '100%',
              padding: 8,
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: '14px'
            }}
            autoFocus
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#666' }}>Description</label>
          <textarea
            placeholder="Add a description..."
            value={task.description}
            onChange={e => setTask({...task, description: e.target.value})}
            style={{
              width: '100%',
              padding: 8,
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: '14px',
              minHeight: 80,
              resize: 'vertical'
            }}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#666' }}>Due Date</label>
          <input
            type="date"
            value={task.dueDate}
            onChange={e => setTask({...task, dueDate: e.target.value})}
            style={{
              width: '100%',
              padding: 8,
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: '14px'
            }}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#666' }}>Priority</label>
          <select
            value={task.priority}
            onChange={e => setTask({...task, priority: e.target.value})}
            style={{
              width: '100%',
              padding: 8,
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: '14px'
            }}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#666' }}>Assignee</label>
          <select
            value={task.assignee}
            onChange={e => setTask({...task, assignee: e.target.value})}
            style={{
              width: '100%',
              padding: 8,
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: '14px'
            }}
          >
            <option value="">Select assignee...</option>
            {assignees.map(assignee => (
              <option key={assignee} value={assignee}>{assignee}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button
            onClick={cancel}
            style={{
              backgroundColor: 'transparent',
              color: '#666',
              border: '1px solid #ddd',
              borderRadius: 4,
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Cancel
          </button>
          <button
            onClick={submit}
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
            {editTask ? 'Update Task' : 'Add Task'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 20 }}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
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
          + Add a card
        </button>
      ) : (
        <div style={{
          backgroundColor: '#fff',
          border: '1px solid #ddd',
          borderRadius: 8,
          padding: 16,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          width: 300
        }}>
          <input
            placeholder="Enter a title for this card..."
            value={task.title}
            onChange={e => setTask({...task, title: e.target.value})}
            style={{
              width: '100%',
              padding: 8,
              border: '1px solid #ddd',
              borderRadius: 4,
              marginBottom: 8,
              fontSize: '14px'
            }}
            autoFocus
          />
          <textarea
            placeholder="Add a description..."
            value={task.description}
            onChange={e => setTask({...task, description: e.target.value})}
            style={{
              width: '100%',
              padding: 8,
              border: '1px solid #ddd',
              borderRadius: 4,
              marginBottom: 8,
              fontSize: '14px',
              minHeight: 60,
              resize: 'vertical'
            }}
          />
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: '12px', color: '#666' }}>Due Date:</label>
            <input
              type="date"
              value={task.dueDate}
              onChange={e => setTask({...task, dueDate: e.target.value})}
              style={{
                width: '100%',
                padding: 8,
                border: '1px solid #ddd',
                borderRadius: 4,
                fontSize: '14px'
              }}
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: '12px', color: '#666' }}>Priority:</label>
            <select
              value={task.priority}
              onChange={e => setTask({...task, priority: e.target.value})}
              style={{
                width: '100%',
                padding: 8,
                border: '1px solid #ddd',
                borderRadius: 4,
                fontSize: '14px'
              }}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: '12px', color: '#666' }}>Assignee:</label>
            <select
              value={task.assignee}
              onChange={e => setTask({...task, assignee: e.target.value})}
              style={{
                width: '100%',
                padding: 8,
                border: '1px solid #ddd',
                borderRadius: 4,
                fontSize: '14px'
              }}
            >
              <option value="">Select assignee...</option>
              {assignees.map(assignee => (
                <option key={assignee} value={assignee}>{assignee}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={submit}
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
              Add Card
            </button>
            <button
              onClick={cancel}
              style={{
                backgroundColor: 'transparent',
                color: '#666',
                border: 'none',
                borderRadius: 4,
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
