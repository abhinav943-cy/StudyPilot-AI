
const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("studypilot_token");

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("studypilot_token");
    }
    throw new Error(data.message || `Request failed (${response.status})`);
  }

  return data;
}

function saveToken(data) {
  if (data?.token) {
    localStorage.setItem("studypilot_token", data.token);
  }
  return data;
}

export const api = {
  // Authentication
  register: async (details) =>
    saveToken(
      await request("/auth/register", {
        method: "POST",
        body: JSON.stringify(details),
      })
    ),

  login: async (details) =>
    saveToken(
      await request("/auth/login", {
        method: "POST",
        body: JSON.stringify(details),
      })
    ),

  getMe: () => request("/auth/me"),

  logout: () => localStorage.removeItem("studypilot_token"),

  // Tasks — database API
  getTasks: () => request("/tasks"),

  createTask: (task) =>
    request("/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    }),

  updateTask: (taskId, changes) =>
    request(`/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify(changes),
    }),

  deleteTask: (taskId) =>
    request(`/tasks/${taskId}`, { method: "DELETE" }),

  generatePlan: (taskId) =>
    request(`/tasks/${taskId}/plan`, { method: "POST" }),

  updateStep: (taskId, stepId, completed) =>
    request(`/tasks/${taskId}/steps/${stepId}`, {
      method: "PATCH",
      body: JSON.stringify({ completed }),
    }),

  // AI Tutor
  askTutor: (message, history = [], topic = "General") =>
    request("/tutor/chat", {
      method: "POST",
      body: JSON.stringify({ message, history, topic }),
    }),

  // AI Quiz
  generateQuiz: (topic, count = 5, taskId) =>
    request("/quiz/generate", {
      method: "POST",
      body: JSON.stringify({ topic, count, taskId }),
    }),

  submitQuiz: (quizId, answers) =>
    request("/quiz/submit", {
      method: "POST",
      body: JSON.stringify({ quizId, answers }),
    }),

  // Analytics and study coach
  getWeeklyAnalytics: () => request("/analytics/weekly"),

  askCoach: (message) =>
    request("/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
};
