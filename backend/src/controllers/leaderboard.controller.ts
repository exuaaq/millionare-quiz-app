
import { Response } from "express"
import { query } from "../config/database"
import type { GameWithUser } from "../models/GameSession. model"
import type { AuthRequest } from "../middleware/auth.middleware"

// GET /api/leaderboard - Top igraci
export async function getLeaderboard(req: AuthRequest, res:  Response): Promise<void> {
  try {
    const { limit = "10" } = req. query
    const parsedLimit = parseInt(limit as string, 10)
    const limitNum = Number.isInteger(parsedLimit) && parsedLimit > 0
        ? Math.min(100, parsedLimit)
        : 10

    console.log("Fetching leaderboard with limit:", limitNum)


    const games = await query<GameWithUser>(
        `SELECT g.*, u.username
       FROM games g
       JOIN users u ON g. user_id = u.id
       WHERE g.completed = true
       ORDER BY g.score DESC, g.finished_at ASC
       LIMIT ${limitNum}`
    )

    console.log("Leaderboard fetched successfully:", games.length, "games")

    res.json({ games })
  } catch (error: any) {
    console.error("Leaderboard Error Details:")
    console.error("Message:", error.message)
    console.error("SQL State:", error.sqlState)
    console.error("SQL Message:", error.sqlMessage)
    console.error("Full Error:", error)

    res.status(500).json({
      error: "Greska pri ucitavanju rang liste",
      details:  process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

// GET /api/leaderboard/recent - recent igre
export async function getRecentGames(req:  AuthRequest, res: Response): Promise<void> {
  try {
    const { limit = "10" } = req.query
    const parsedLimit = parseInt(limit as string, 10)
    const limitNum = Number.isInteger(parsedLimit) && parsedLimit > 0
        ? Math.min(100, parsedLimit)
        : 10

    console.log("Fetching recent games with limit:", limitNum)


    const games = await query<GameWithUser>(
        `SELECT g.*, u.username
       FROM games g
       JOIN users u ON g.user_id = u.id
       WHERE g. completed = true
       ORDER BY g.finished_at DESC
       LIMIT ${limitNum}`
    )

    console.log("Recent games fetched successfully:", games.length, "games")

    res.json({ games })
  } catch (error: any) {
    console.error("  Recent Games Error Details:")
    console.error("  Message:", error.message)
    console.error("  SQL State:", error.sqlState)
    console.error("  SQL Message:", error.sqlMessage)
    console.error("  Full Error:", error)

    res.status(500).json({
      error: "Greska pri ucitavnaju recent igara",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}