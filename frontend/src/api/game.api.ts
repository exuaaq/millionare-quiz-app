// ============================================
// GAME API
// ============================================
// API pozivi za igre
// ============================================

import { apiClient } from "./axios.config"

export interface Game {
  id: number
  user_id: number
  score: number
  questions_answered: number
  completed: boolean
  finished_at: Date | null
  created_at: Date
}

export interface GameWithUser extends Game {
  username: string
}

// Dohvat liste igara
export async function getGames(userId?: number, limit: number = 10) {
  const params = new URLSearchParams()
  if (userId) params.append("user_id", userId.toString())
  params.append("limit", limit.toString())

  const response = await apiClient.get(`/games?${params.toString()}`)
  return response.data
}

// Dohvat pojedinacne igre
export async function getGameById(gameId: number) {
  const response = await apiClient.get(`/games/${gameId}`)
  return response.data
}

// azuriranje igre
export async function updateGame(
  gameId: number,
  data: {
    score?: number
    questions_answered?: number
    completed?: boolean
  }
) {
  const response = await apiClient.put(`/games/${gameId}`, data)
  return response.data
}
