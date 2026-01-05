// ============================================
// USER API
// ============================================
// API pozivi za korisnike
// ============================================

import { apiClient } from "./axios.config"

export interface SafeUser {
  id: number
  username: string
  email: string
  created_at: Date
}

export interface UserStats {
  totalGames: number
  completedGames: number
  bestScore: number
  totalWinnings: number
  recentGames: any[]
}

// Dohvat korisnika po ID-u
export async function getUserById(userId: number) {
  const response = await apiClient.get(`/users/${userId}`)
  return response.data
}

// Dohvat statistike korisnika
export async function getUserStats(userId: number): Promise<{ stats: UserStats }> {
  const response = await apiClient.get(`/users/${userId}/stats`)
  return response.data
}

// Dohvat svih korisnika
export async function getAllUsers() {
  const response = await apiClient.get("/users")
  return response.data
}
