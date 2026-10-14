const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const getTasks = () => request("/tasks");

export const createTask = (title) =>
  request("/tasks", { method: "POST", body: JSON.stringify({ title }) });

export const updateTask = (id, updates) =>
  request(`/tasks/${id}`, { method: "PUT", body: JSON.stringify(updates) });

export const deleteTask = (id) => request(`/tasks/${id}`, { method: "DELETE" });
