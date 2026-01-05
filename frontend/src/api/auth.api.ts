// ============================================
// AUTH API
// ============================================
// API pozivi za autentifikaciju
// ============================================

import { apiClient } from "./axios.config"

export interface LoginDTO {
  email: string
  password: string
}

export interface RegisterDTO {
  username: string
  email: string
  password: string
}

export interface AuthResponse {
  message: string
  token: string
  user: {
    id: number
    username: string
    email: string
    created_at: Date
  }
}

// Registracija novog korisnika
export async function register(data: RegisterDTO): Promise<AuthResponse> {
  const response = await apiClient.post("/auth/register", data)
  return response.data
}

// Prijava korisnika
export async function login(data: LoginDTO): Promise<AuthResponse> {
  const response = await apiClient.post("/auth/login", data)
  return response.data
}

// Dohvat trenutnog korisnika
export async function getCurrentUser() {
  const response = await apiClient.get("/auth/me")
  return response.data
}

// Odjava korisnika
export async function logout() {
  const response = await apiClient.post("/auth/logout")
  return response.data
}
