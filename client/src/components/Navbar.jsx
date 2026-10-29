
import { Bell, BrainCircuit, Search } from "lucide-react";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-slate-800 px-4 py-4 md:px-8">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-violet-600 p-2">
          <BrainCircuit size={22} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">StudyPilot AI</h1>
          <p className="text-xs text-slate-400">Your personal study companion</p>
        </div>
      </div>

      <div className="hidden max-w-xs flex-1 md:flex">
        <div className="flex w-full items-center gap-2 rounded-xl border border-slate-800 px-3 py-2 text-slate-400">
          <Search size={17} />
          <span className="text-sm">Study smarter...</span>
        </div>
      </div>

      <button
        type="button"
        aria-label="Notifications"
        className="rounded-xl border border-slate-800 p-2 text-slate-300 hover:bg-slate-800"
      >
        <Bell size={19} />
      </button>
    </header>
  );
}
