import React, { useEffect,useState } from "react";
import Tasks from "./Tasks";
import "./Todo.css";

const Todo = () => {
  const apiUrl = "http://localhost:3000/tasks";

  const [task, setTask] = useState({ taskName: "", taskStatus: "", taskDescription: "" });
  const [todos, setTodos] = useState([]);

  const fetchTodos = async () => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (task.taskName.trim() !== "") {
      try {
        const newTask = {
          taskName: task.taskName,
          taskStatus: "Pending",
          taskDescription: "This is a new task",
        };

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTask),
        });

        if (!response.ok) {
          throw new Error("Failed to create a new task");
        }

        const createdTask = await response.json();
        setTodos((prevTodos) => [...prevTodos, createdTask]);
        setTask({ taskName: "", taskStatus: "", taskDescription: "" });
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleDelete = async (delId) => {
    try {
      const response = await fetch(`${apiUrl}/${delId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the task");
      }

      setTodos((prevTodos) => prevTodos.filter((task) => task._id !== delId));
      alert("Deleted Successfully");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUpdate = async (updateId, updatedTask) => {
    try {
      const response = await fetch(`${apiUrl}/${updateId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        throw new Error("Failed to update the task");
      }

      const updatedTaskFromServer = await response.json();
      setTodos((prevTodos) =>
        prevTodos.map((task) => (task._id === updateId ? updatedTaskFromServer : task))
      );

      alert("Updated Successfully");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Updated handleUpperCase with PATCH request to the server
  const handleUpperCase = async (upperId) => {
    try {
      const taskToUpdate = todos.find((task) => task._id === upperId);
      const updatedTask = { ...taskToUpdate, taskName: taskToUpdate.taskName.toUpperCase() };

      const response = await fetch(`${apiUrl}/${upperId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        throw new Error("Failed to capitalize the task name");
      }

      const updatedTaskFromServer = await response.json();
      setTodos((prevTodos) =>
        prevTodos.map((task) => (task._id === upperId ? updatedTaskFromServer : task))
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Updated handleMarkedDone with PATCH request to the server
  const handleMarkedDone = async (doneId) => {
    try {
      const taskToUpdate = todos.find((task) => task._id === doneId);
      const updatedTask = { ...taskToUpdate, taskStatus: "Completed" };

      const response = await fetch(`${apiUrl}/${doneId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        throw new Error("Failed to mark the task as completed");
      }

      const updatedTaskFromServer = await response.json();
      setTodos((prevTodos) =>
        prevTodos.map((task) => (task._id === doneId ? updatedTaskFromServer : task))
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h1>TODO LIST</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="task">Enter: </label>
        <input
          onChange={(e) => setTask({ taskName: e.target.value })}
          type="text"
          name="task"
          value={task.taskName}
          id="task"
        />
        <button>Add</button>
      </form>
      <hr /> <br />
      <h4>TASKS</h4>
      <Tasks
        array={todos}
        onDelete={handleDelete}
        onUpperCase={handleUpperCase}
        onMark={handleMarkedDone}
        onUpdate={handleUpdate}
        handleChange={handleUpdate}
      />
      <br />
    </div>
  );
};

export default Todo;
