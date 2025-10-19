// src/Components/Tasks.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../Supabase";

const Tasks = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editing, setEditing] = useState({});

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.uid)
      .order("id", { ascending: true });
    if (error) console.error("Error fetching tasks:", error);
    else setTasks(data);
  };

  // Add a new task
  const addTask = async () => {
    if (!newTask.trim()) return;
    const { error } = await supabase.from("tasks").insert({
      user_id: user.uid,
      task: newTask.trim(),
      completed: false,
    });
    if (error) console.error("Error adding task:", error);
    else {
      setNewTask("");
      fetchTasks();
    }
  };

  // Toggle task completion
  const toggleComplete = async (task) => {
    const { error } = await supabase
      .from("tasks")
      .update({ completed: !task.completed })
      .eq("id", task.id);
    if (error) console.error("Error updating task:", error);
    else fetchTasks();
  };

  // Delete task
  const deleteTask = async (id) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) console.error("Error deleting task:", error);
    else fetchTasks();
  };

  // Save edited task
  const saveTask = async (task) => {
    const { error } = await supabase
      .from("tasks")
      .update({ task: task.task })
      .eq("id", task.id);
    if (error) console.error("Error saving task:", error);
    else {
      setEditing({});
      fetchTasks();
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-pink-600">My Tasks</h2>

      {/* Add New Task */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="New task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-1 border px-3 py-2 rounded-lg"
        />
        <button
          onClick={addTask}
          className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600"
        >
          Add
        </button>
      </div>

      {/* Task List */}
      <ul className="space-y-2">
        {tasks.map((t) => (
          <li
            key={t.id}
            className="flex items-center justify-between bg-white p-3 rounded-xl shadow"
          >
            {editing[t.id] ? (
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={editing[t.id].task}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      [t.id]: { ...t, task: e.target.value },
                    })
                  }
                  className="flex-1 border px-2 py-1 rounded-lg"
                />
                <button
                  onClick={() => saveTask(editing[t.id])}
                  className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing({ ...editing, [t.id]: undefined })}
                  className="bg-gray-300 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <div
                  className={`flex-1 cursor-pointer ${
                    t.completed ? "line-through text-gray-400" : ""
                  }`}
                  onClick={() => toggleComplete(t)}
                >
                  {t.task}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditing({ ...editing, [t.id]: t })}
                    className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(t.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
