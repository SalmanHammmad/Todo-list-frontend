import React, { useState } from "react";
import "./Tasks.css";

const Tasks = ({
  array,
  onDelete,
  onUpperCase,
  onMark,
  onUpdate,
  handleChange,
}) => {
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');

  const handleSave = async (id) => {
    try {
      
      const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskName: editName }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();
      onUpdate(id, updatedTask); 
      setEditId(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <ul className="taskList">
      {array.map((task) => (
        <li key={task._id} className="taskItem">
          <div className="taskContent">
            {editId === task._id ? (
              <input
                className="taskName"
                onChange={(e) => setEditName(e.target.value)}
                type="text"
                name="task"
                id={`task-${task._id}`}
                value={editName}
              />
            ) : (
              <span className="taskName">{task.taskName}</span>
            )}
            <span className="taskStatus">
              Status:{" "}
              <span
                className={task.taskStatus === "Pending" ? "pending" : "completed"}
              >
                {task.taskStatus}
              </span>
            </span> 
          </div>
          <div className="buttonDiv">
            <button className="delete" onClick={() => onDelete(task._id)}>DELETE</button>
            <button className="upperCase" onClick={() => onUpperCase(task._id)}>CAPITALIZE</button>
            <button className="markAsDone" onClick={() => onMark(task._id)}>DONE</button>
            {editId === task._id 
                ? (<button className="save" onClick={() => handleSave(task._id)}>SAVE</button>)
                : (<button className="edit" onClick={() => {setEditId(task._id); setEditName(task.taskName)}}>EDIT</button>)
            }
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Tasks;
