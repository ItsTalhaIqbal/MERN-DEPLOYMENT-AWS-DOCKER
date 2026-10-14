import { useEffect, useState } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "./api";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const task = await createTask(title);
      setTasks((prev) => [task, ...prev]);
      setTitle("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggle = async (task) => {
    try {
      const updated = await updateTask(task._id, { completed: !task.completed });
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="container">
      <h1>Task Manager</h1>
      <p className="subtitle">MERN stack deployed on AWS EC2 with Docker</p>

      <form onSubmit={handleAdd} className="task-form">
        <input
          type="text"
          placeholder="Add a new task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {error && <p className="error">{error}</p>}
      {loading && <p>Loading...</p>}
      {!loading && tasks.length === 0 && <p className="empty">No tasks yet.</p>}

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task._id} className={task.completed ? "done" : ""}>
            <label>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggle(task)}
              />
              <span>{task.title}</span>
            </label>
            <button className="delete" onClick={() => handleDelete(task._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
