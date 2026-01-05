// ============================================
// CONTROLLER: User
// ============================================
// Korisnički profil i statistika
// ============================================

import { Response } from "express"
import { query } from "../config/database"
import type { User, SafeUser } from "../models/User.model"
import type { GameSession } from "../models/GameSession.model"
import type { AuthRequest } from "../middleware/auth.middleware"

// GET /api/users/:id - juzer profil
export async function getUserById(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = parseInt(req.params.id, 10)

    const users = await query<User>("SELECT * FROM users WHERE id = ?", [userId])

    if (users.length === 0) {
      res.status(404).json({ error: "Korisnik nije pronađen" })
      return
    }

    const user = users[0]
    const safeUser: SafeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at,
    }

    res.json({ user: safeUser })
  } catch (error) {
    console.error("Greška pri dohvaćanju korisnika:", error)
    res.status(500).json({ error: "Interna greška servera" })
  }
}

// GET /api/users/:id/stats - Statistika korisnika
export async function getUserStats(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = parseInt(req.params.id, 10)

    // Ukupan broj igara
    const totalGamesResult = await query<{ count: number }>(
      "SELECT COUNT(*) as count FROM games WHERE user_id = ?",
      [userId]
    )
    const totalGames = totalGamesResult[0]?.count || 0

    // br gotovih igara
    const completedGamesResult = await query<{ count: number }>(
      "SELECT COUNT(*) as count FROM games WHERE user_id = ? AND completed = true",
      [userId]
    )
    const completedGames = completedGamesResult[0]?.count || 0

    // Najbolji rezultat
    const bestScoreResult = await query<{ score: number }>(
      "SELECT MAX(score) as score FROM games WHERE user_id = ?",
      [userId]
    )
    const bestScore = bestScoreResult[0]?.score || 0

    // Ukupan osvojeni novac
    const totalWinningsResult = await query<{ total: number }>(
      "SELECT SUM(score) as total FROM games WHERE user_id = ? AND completed = true",
      [userId]
    )
    const totalWinnings = totalWinningsResult[0]?.total || 0

    // Posljednje igre
    const recentGames = await query<GameSession>(
      "SELECT * FROM games WHERE user_id = ? ORDER BY created_at DESC LIMIT 5",
      [userId]
    )

    res.json({
      stats: {
        totalGames,
        completedGames,
        bestScore,
        totalWinnings,
        recentGames,
      },
    })
  } catch (error) {
    console.error("Greška pri dohvaćanju statistike:", error)
    res.status(500).json({ error: "Interna greška servera" })
  }
}

// GET /api/users - Lista svih korisnika
export async function getAllUsers(_req: AuthRequest, res: Response): Promise<void> {
  try {
    const users = await query<User>("SELECT * FROM users ORDER BY created_at DESC")

    const safeUsers: SafeUser[] = users.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at,
    }))

    res.json({ users: safeUsers })
  } catch (error) {
    console.error("Greška pri dohvaćanju korisnika:", error)
    res.status(500).json({ error: "Interna greška servera" })
  }
}
