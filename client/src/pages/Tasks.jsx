
import { useState } from "react";
import { Sparkles, Plus } from "lucide-react";
import TaskCard from "../components/TaskCard";
import { useApp } from "../context/AppContext";
import { api } from "../services/api";

export default function Tasks() {
  const {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    loadTasks,
  } = useApp();

  const [form, setForm] = useState({
    title: "",
    subject: "DSA",
    description: "",
  });

  const [filter, setFilter] = useState("all");
  const [loadingId, setLoadingId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function handleAdd(event) {
    event.preventDefault();

    if (!form.title.trim()) return;

    setSaving(true);
    setError("");
    setNotice("");

    try {
      await addTask({
        title: form.title.trim(),
        subject: form.subject,
        description: form.description.trim(),
      });

      setForm({
        title: "",
        subject: "DSA",
        description: "",
      });

      setNotice("Task MongoDB mein save ho gaya.");
    } catch (err) {
      setError(err.message || "Task save nahi ho paya.");
    } finally {
      setSaving(false);
    }
  }

  async function generatePlan(task) {
    if (!task.id) {
      setError("Task ID nahi mila. Task ko dobara create karke try karo.");
      return;
    }

    setLoadingId(task.id);
    setError("");
    setNotice("");

    try {
      // Backend AI plan generate karke Task document mein steps save karega.
      await api.generatePlan(task.id);

      // Database se updated task aur uske steps reload karo.
      await loadTasks();

      setNotice(`AI study plan "${task.title}" ke liye generate ho gaya.`);
    } catch (err) {
      setError(err.message || "AI plan generate nahi ho paya.");
    } finally {
      setLoadingId("");
    }
  }

  async function handleToggle(taskId) {
    setError("");
    setNotice("");

    try {
      await toggleTask(taskId);
    } catch (err) {
      setError(err.message || "Task update nahi ho paya.");
    }
  }

  async function handleDelete(taskId) {
    setError("");
    setNotice("");

    try {
      await deleteTask(taskId);
      setNotice("Task delete ho gaya.");
    } catch (err) {
      setError(err.message || "Task delete nahi ho paya.");
    }
  }

  const visibleTasks = tasks.filter((task) => {
    if (filter === "pending") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white md:text-3xl">
          My Tasks
        </h1>
        <p className="mt-2 text-slate-400">
          Plan your learning and track every step.
        </p>
      </div>

      <form onSubmit={handleAdd} className="panel space-y-4 p-5">
        <h2 className="font-semibold text-white">Create a study task</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-300">
            Task title *
            <input
              className="input-field"
              placeholder="e.g. Learn Java LinkedList"
              value={form.title}
              onChange={(event) =>
                setForm({ ...form, title: event.target.value })
              }
              required
            />
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            Subject
            <select
              className="input-field"
              value={form.subject}
              onChange={(event) =>
                setForm({ ...form, subject: event.target.value })
              }
            >
              <option>DSA</option>
              <option>Java</option>
              <option>JavaScript</option>
              <option>React</option>
              <option>Database</option>
              <option>Other</option>
            </select>
          </label>
        </div>

        <label className="block space-y-2 text-sm text-slate-300">
          What do you want to learn?
          <textarea
            className="input-field min-h-20 resize-y"
            placeholder="Add your goal or any specific topic..."
            value={form.description}
            onChange={(event) =>
              setForm({ ...form, description: event.target.value })
            }
          />
        </label>

        <button type="submit" disabled={saving} className="primary-btn disabled:opacity-50">
          <Plus size={18} />
          {saving ? "Saving..." : "Add task"}
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {["all", "pending", "completed"].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`rounded-xl px-4 py-2 text-sm capitalize ${
              filter === item
                ? "bg-violet-600 text-white"
                : "border border-slate-800 text-slate-400 hover:bg-slate-800"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300"
        >
          {error}
        </p>
      )}

      {notice && (
        <p
          role="status"
          className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-300"
        >
          {notice}
        </p>
      )}

      <div className="space-y-3">
        {visibleTasks.map((task) => (
          <div key={task.id} className="space-y-2">
            <TaskCard
              task={task}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />

            {!task.completed && (
              <button
                type="button"
                onClick={() => generatePlan(task)}
                disabled={loadingId === task.id}
                className="secondary-btn ml-2 inline-flex items-center gap-2 text-sm disabled:opacity-50"
              >
                <Sparkles size={16} />
                {loadingId === task.id
                  ? "Generating..."
                  : "Generate AI study plan"}
              </button>
            )}

            {task.steps?.length > 0 && (
              <div className="ml-2 space-y-2 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                <h3 className="font-medium text-white">Study plan</h3>

                {task.steps.map((step, index) => (
                  <div
                    key={step.id || step._id || index}
                    className="flex items-start gap-3 text-sm"
                  >
                    <span className="text-slate-500">{index + 1}.</span>
                    <div>
                      <p className={step.completed ? "text-slate-500 line-through" : "text-slate-200"}>
                        {step.title}
                      </p>
                      {step.description && (
                        <p className="mt-1 text-slate-500">
                          {step.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {!visibleTasks.length && (
          <div className="panel p-8 text-center text-slate-400">
            No tasks in this section. Add a task above to get started.
          </div>
        )}
      </div>
    </div>
  );
}
