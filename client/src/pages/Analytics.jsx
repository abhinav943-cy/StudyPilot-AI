
import { CheckCircle2, ListTodo, Target } from "lucide-react";
import ProgressChart from "../components/ProgressChart";
import { useApp } from "../context/AppContext";
import { getCompletion } from "../features/task/taskUtils";
import { getWeeklyProgress } from "../features/progress/progressUtils";

export default function Analytics() {
  const { tasks } = useApp();
  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.length - completed;
  const completion = getCompletion(tasks);
  const weekly = getWeeklyProgress(tasks);

  const bestDay = [...weekly].sort((a, b) => b.completed - a.completed)[0];

  const stats = [
    { label: "Total tasks", value: tasks.length, icon: ListTodo },
    { label: "Completed", value: completed, icon: CheckCircle2 },
    { label: "Completion rate", value: `${completion}%`, icon: Target },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white md:text-3xl">Your Analytics</h1>
        <p className="mt-2 text-slate-400">Review your study activity and identify what to improve.</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="panel p-5">
            <Icon className="mb-4 text-violet-300" size={24} />
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="mt-1 text-sm text-slate-400">{label}</p>
          </div>
        ))}
      </section>

      <ProgressChart data={weekly} />

      <section className="panel p-5">
        <h2 className="font-semibold text-white">Study summary</h2>
        <div className="mt-4 space-y-3 text-sm text-slate-300">
          <p>• Pending tasks: <strong>{pending}</strong></p>
          <p>• Completed tasks: <strong>{completed}</strong></p>
          <p>
            • Most productive day in the displayed week:{" "}
            <strong>{bestDay?.completed > 0 ? bestDay.day : "No completed tasks recorded"}</strong>
          </p>
        </div>
        <p className="mt-4 text-xs leading-5 text-slate-500">
          These statistics are based on tasks recorded in this browser. They do not yet measure
          quiz mastery, actual study time, or learning quality.
        </p>
      </section>
    </div>
  );
}
