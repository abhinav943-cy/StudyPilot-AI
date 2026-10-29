
import { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Tutor from "./pages/Tutor";
import Quiz from "./pages/Quiz";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import { useApp } from "./context/AppContext";

const pageTitles = {
  dashboard: "Dashboard",
  tasks: "My Tasks",
  tutor: "AI Tutor",
  quiz: "Practice Quiz",
  analytics: "Analytics",
};

export default function App() {
   const [page, setPage] = useState("dashboard");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user, loading, logout } = useApp();

  function handleMobilePageChange(nextPage) {
    setPage(nextPage);
    setMobileMenuOpen(false);
  }

  if (loading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-[#080b14] text-slate-300">
        Loading StudyPilot AI...
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[#080b14] text-slate-200">
      {/* Navbar */}
      <header className="z-20 shrink-0 border-b border-slate-800">
        <Navbar />
      </header>

      {/* Welcome and Logout */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-800 px-4 py-3 md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-700 text-xl text-slate-200 transition hover:bg-slate-800 md:hidden"
          >
            ☰
          </button>

          <div className="min-w-0">
            <p className="truncate text-sm text-slate-300">
              Welcome, {user.name || user.email}
            </p>
            <p className="text-xs text-slate-500">
              Your personal study workspace
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="shrink-0 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
        >
          Logout
        </button>
      </div>

      {/* Main layout */}
      <div className="grid min-h-0 flex-1 md:grid-cols-[230px_minmax(0,1fr)]">
        {/* Desktop sidebar */}
        <aside className="hidden min-h-0 overflow-hidden border-r border-slate-800 md:block">
          <Sidebar page={page} setPage={setPage} />
        </aside>

        {/* Only this area scrolls */}
        <main className="min-h-0 min-w-0 overflow-x-hidden overflow-y-auto overscroll-contain p-4 md:p-8">
          <div className="mx-auto mb-5 max-w-7xl">
            <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
              StudyPilot AI / {pageTitles[page]}
            </p>
          </div>

          <div className="mx-auto max-w-7xl">
            {/* Keep pages mounted so their local state survives navigation */}
            <div className={page === "dashboard" ? "block" : "hidden"}>
              <Dashboard setPage={setPage} />
            </div>

            <div className={page === "tasks" ? "block" : "hidden"}>
              <Tasks />
            </div>

            <div className={page === "tutor" ? "block" : "hidden"}>
              <Tutor />
            </div>

            <div className={page === "quiz" ? "block" : "hidden"}>
              <Quiz />
            </div>

            <div className={page === "analytics" ? "block" : "hidden"}>
              <Analytics />
            </div>
          </div>
        </main>
      </div>

      {/* Mobile sidebar drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden md:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 h-full w-full bg-black/60"
          />

          <aside className="absolute inset-y-0 left-0 flex h-full w-[min(280px,85vw)] min-w-0 flex-col overflow-hidden border-r border-slate-800 bg-[#080b14] shadow-2xl">
            <div className="flex shrink-0 items-center justify-between border-b border-slate-800 px-4 py-4">
              <span className="font-semibold text-slate-100">
                Navigation
              </span>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-700 text-xl hover:bg-slate-800"
              >
                ×
              </button>
            </div>

            <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
              <Sidebar
                page={page}
                setPage={handleMobilePageChange}
              />
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
