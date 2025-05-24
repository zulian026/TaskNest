// src/services/api.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post("/register", data),
  login: (data) => api.post("/login", data),
  logout: () => api.post("/logout"),
  getUser: () => api.get("/user"),

  // GitHub Auth
  getGitHubAuthUrl: () => api.get("/auth/github/redirect"),
  unlinkGitHub: () => api.post("/auth/github/unlink"),

  // Profile management methods
  getProfile: () => api.get("/profile"),
  updateProfile: (formData) => {
    return api.post("/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: { _method: "PUT" },
    });
  },
  updateAvatar: (formData) => {
    return api.post("/profile/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  deleteAvatar: () => api.delete("/profile/avatar"),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get("/categories"),
  create: (data) => api.post("/categories", data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Tasks API
export const tasksAPI = {
  getAll: (params = {}) => api.get("/tasks", { params }),
  create: (data) => api.post("/tasks", data),
  getById: (id) => api.get(`/tasks/${id}`),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  updateStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }),
  filter: (filter) => api.get(`/tasks/filter/${filter}`),
};

export default api;
