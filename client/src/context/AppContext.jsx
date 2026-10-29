
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "../services/api";

const AppContext = createContext(null);

function normalizeTask(task) {
  return {
    ...task,
    id: task._id || task.id,
    steps: (task.steps || []).map((step) => ({
      ...step,
      id: step._id || step.id,
    })),
  };
}

function getTaskFromResponse(data) {
  const task = data?.task || data;
  return task && (task._id || task.id) ? normalizeTask(task) : null;
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTasks = useCallback(async () => {
    const data = await api.getTasks();
    const list = Array.isArray(data) ? data : data.tasks || [];
    setTasks(list.map(normalizeTask));
  }, []);

  const refreshUser = useCallback(async () => {
    const data = await api.getMe();
    setUser(data.user || data);
  }, []);

  useEffect(() => {
    let active = true;

    async function initialize() {
      if (!localStorage.getItem("studypilot_token")) {
        if (active) {
          setUser(null);
          setTasks([]);
          setLoading(false);
        }
        return;
      }

      try {
        const [userData, taskData] = await Promise.all([
          api.getMe(),
          api.getTasks(),
        ]);

        if (!active) return;

        setUser(userData.user || userData);
        const list = Array.isArray(taskData)
          ? taskData
          : taskData.tasks || [];
        setTasks(list.map(normalizeTask));
      } catch {
        api.logout();
        if (active) {
          setUser(null);
          setTasks([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    initialize();

    return () => {
      active = false;
    };
  }, []);

  const login = async (details) => {
    setError("");
    const data = await api.login(details);

    try {
      await refreshUser();
      await loadTasks();
    } catch (err) {
      api.logout();
      throw err;
    }

    return data;
  };

  const register = async (details) => {
    setError("");
    const data = await api.register(details);

    try {
      await refreshUser();
      await loadTasks();
    } catch (err) {
      api.logout();
      throw err;
    }

    return data;
  };

  const logout = () => {
    api.logout();
    setUser(null);
    setTasks([]);
    setError("");
  };

  const addTask = async (task) => {
    setError("");
    const data = await api.createTask(task);
    const savedTask = getTaskFromResponse(data);

    if (!savedTask) {
      await loadTasks();
      return data;
    }

    setTasks((current) => [savedTask, ...current]);
    return savedTask;
  };

  const updateTask = async (taskId, changes) => {
    setError("");
    const data = await api.updateTask(taskId, changes);
    const updatedTask = getTaskFromResponse(data);

    if (updatedTask) {
      setTasks((current) =>
        current.map((task) =>
          task.id === taskId ? updatedTask : task
        )
      );
    } else {
      await loadTasks();
    }

    return updatedTask || data;
  };

  const toggleTask = async (taskId) => {
    const task = tasks.find((item) => item.id === taskId);
    if (!task) return;

    return updateTask(taskId, {
      completed: !task.completed,
    });
  };

  const deleteTask = async (taskId) => {
    setError("");
    await api.deleteTask(taskId);
    setTasks((current) => current.filter((task) => task.id !== taskId));
  };

  const value = {
    user,
    tasks,
    loading,
    error,
    setError,
    login,
    register,
    logout,
    refreshUser,
    loadTasks,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used inside AppProvider");
  }

  return context;
}
