
const configuredUrl = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const API_ROOT = configuredUrl.endsWith("/api")
  ? configuredUrl
  : `${configuredUrl}/api`;

const CHAT_URL = `${API_ROOT}/tutor-chats`;

async function request(url, options = {}) {
  const token = localStorage.getItem("studypilot_token");

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Tutor chat request failed.");
  }

  return data;
}

export const tutorChatApi = {
  getAll() {
    return request(CHAT_URL);
  },

  create({ title, topic }) {
    return request(CHAT_URL, {
      method: "POST",
      body: JSON.stringify({ title, topic }),
    });
  },

  getById(id) {
    return request(`${CHAT_URL}/${encodeURIComponent(id)}`);
  },

  update(id, updates) {
    return request(`${CHAT_URL}/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },

  delete(id) {
    return request(`${CHAT_URL}/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },
};
