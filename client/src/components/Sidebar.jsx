
import {
  LayoutDashboard,
  ListTodo,
  BookOpen,
  BrainCircuit,
  ChartNoAxesCombined,
} from "lucide-react";

const links = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "tasks", label: "My Tasks", icon: ListTodo },
  { id: "tutor", label: "AI Tutor", icon: BookOpen },
  { id: "quiz", label: "Practice Quiz", icon: BrainCircuit },
  { id: "analytics", label: "Analytics", icon: ChartNoAxesCombined },
];

export default function Sidebar({ page, setPage }) {
  return (
    <aside className="min-w-0 border-slate-800 p-3 md:min-h-[calc(100vh-73px)] md:border-r md:p-5">
      <p className="mb-3 hidden px-3 text-xs font-semibold uppercase tracking-widest text-slate-500 md:block">
        Workspace
      </p>

      {/* Vertical navigation on all screen sizes */}
      <nav className="flex min-w-0 flex-col gap-2 overflow-x-hidden">
        {links.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setPage(id)}
            className={`flex w-full min-w-0 shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
              page === id
                ? "bg-violet-600 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Icon size={19} className="shrink-0" />

            <span className="min-w-0 break-words">
              {label}
            </span>
          </button>
        ))}
      </nav>

      {/* Study tip: visible on mobile and desktop */}
      <div className="mt-6 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4">
        <BrainCircuit
          className="mb-3 text-violet-300"
          size={24}
        />

        <p className="font-semibold text-white">
          Study with purpose
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-400">
          Break big goals into small, manageable steps.
        </p>

        <button
          type="button"
          onClick={() => setPage("tutor")}
          className="mt-3 text-sm font-semibold text-violet-300 hover:text-violet-200"
        >
          Open AI Tutor →
        </button>
      </div>
    </aside>
  );
}
