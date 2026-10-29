
import { Check, Clock3, Trash2 } from "lucide-react";

export default function TaskCard({ task, onToggle, onDelete }) {
  return (
    <article className="panel flex items-start gap-3 p-4">
      <button
        type="button"
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? "Mark as pending" : "Complete task"}
        className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
          task.completed
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-slate-600 text-transparent hover:border-violet-400"
        }`}
      >
        <Check size={14} />
      </button>

      <div className="min-w-0 flex-1">
        <h3
          className={`font-semibold ${
            task.completed ? "text-slate-500 line-through" : "text-white"
          }`}
        >
          {task.title}
        </h3>
        <p className="mt-1 text-sm text-slate-400">{task.subject}</p>

        {task.description && (
          <p className="mt-2 text-sm leading-5 text-slate-400">
            {task.description}
          </p>
        )}

        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <Clock3 size={13} />
          {task.completed ? "Completed" : "Pending"}
        </div>

        {task.plan?.length > 0 && (
          <ol className="mt-3 list-inside list-decimal space-y-1 text-sm text-slate-300">
            {task.plan.map((step, index) => (
              <li key={step.id || index}>
                {typeof step === "string" ? step : step.title}
              </li>
            ))}
          </ol>
        )}
      </div>

      <button
        type="button"
        onClick={() => onDelete(task.id)}
        aria-label="Delete task"
        className="rounded-lg p-2 text-slate-500 hover:bg-red-500/10 hover:text-red-400"
      >
        <Trash2 size={17} />
      </button>
    </article>
  );
}
