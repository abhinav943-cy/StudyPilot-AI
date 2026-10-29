
import { BookOpen, CheckCircle2, ListTodo, Target } from "lucide-react";
import { getCompletion, getPendingTasks } from "../features/task/taskUtils";
import { getWeeklyProgress } from "../features/progress/progressUtils";
import { getGreeting } from "../utils/date";
import ProgressChart from "../components/ProgressChart";
import TaskCard from "../components/TaskCard";
import { useApp } from "../context/AppContext";

export default function Dashboard({ setPage }) {
  const { tasks, toggleTask, deleteTask } = useApp();
  const completed = tasks.filter((task) => task.completed).length;
  const pending = getPendingTasks(tasks);
  const completion = getCompletion(tasks);
  const weekly = getWeeklyProgress(tasks);

  const stats = [
    { label: "Total tasks", value: tasks.length, icon: ListTodo, color: "text-violet-300" },
    { label: "Completed", value: completed, icon: CheckCircle2, color: "text-emerald-300" },
    { label: "Pending", value: pending.length, icon: BookOpen, color: "text-amber-300" },
    { label: "Completion", value: `${completion}%`, icon: Target, color: "text-sky-300" },
  ];

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm text-violet-300">{getGreeting()} 👋</p>
        <h1 className="mt-1 text-2xl font-bold text-white md:text-3xl">
          Ready to learn something new?
        </h1>
        <p className="mt-2 text-slate-400">
          Small steps today, stronger skills tomorrow.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="panel p-4 md:p-5">
            <div className={`mb-4 inline-flex rounded-xl bg-slate-800 p-2 ${color}`}>
              <Icon size={21} />
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="mt-1 text-sm text-slate-400">{label}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <ProgressChart data={weekly} />

        <div className="panel flex flex-col justify-between p-5">
          <div>
            <div className="mb-3 inline-flex rounded-xl bg-violet-500/15 p-3 text-violet-300">
              <BookOpen size={24} />
            </div>
            <h2 className="text-lg font-semibold text-white">Need help understanding a topic?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Ask the AI Tutor to explain concepts, plan your learning, and help you practise.
            </p>
          </div>
          <button className="primary-btn mt-5 w-full" onClick={() => setPage("tutor")}>
            Open AI Tutor
          </button>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">Your tasks</h2>
          <button onClick={() => setPage("tasks")} className="text-sm font-medium text-violet-300">
            View all →
          </button>
        </div>

        {tasks.length ? (
          <div className="space-y-3">
            {tasks.slice(0, 3).map((task) => (
              <TaskCard key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
            ))}
          </div>
        ) : (
          <div className="panel p-8 text-center">
            <ListTodo className="mx-auto text-slate-500" size={32} />
            <p className="mt-3 font-medium text-white">No tasks yet</p>
            <p className="mt-1 text-sm text-slate-400">Add your first study task to get started.</p>
            <button onClick={() => setPage("tasks")} className="primary-btn mt-4">
              Create a task
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
