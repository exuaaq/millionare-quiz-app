// ============================================
// AXIOS CONFIGURATION
// ============================================
// Centralizovana konfiguracija za HTTP pozive
// ============================================

import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

// Kreiranje axios instance
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor - dodaje JWT token u svaki zahtjev
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - hendluje greske
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token je istekao ili nije validan
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)
