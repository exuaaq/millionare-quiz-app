// ============================================
// LEADERBOARD API
// ============================================
// API pozivi za leaderboard
// ============================================

import { apiClient } from "./axios.config"
import type { GameWithUser } from "./game.api"

// Dohvat leaderboard-a
export async function getLeaderboard(limit: number = 10): Promise<{ games: GameWithUser[] }> {
  const response = await apiClient.get(`/leaderboard?limit=${limit}`)
  return response.data
}

// Dohvat recent igara
export async function getRecentGames(limit: number = 10): Promise<{ games: GameWithUser[] }> {
  const response = await apiClient.get(`/leaderboard/recent?limit=${limit}`)
  return response.data
}
