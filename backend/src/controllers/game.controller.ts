// ============================================
// CONTROLLER: Game
// ============================================
// Upravljanje igrama (start, update, quit)
// ============================================

import { Response } from "express"
import { query } from "../config/database"
import type { GameSession, GameWithUser } from "../models/GameSession.model"
import type { AuthRequest } from "../middleware/auth.middleware"

// POST /api/quiz/start - pokreni novu igru
export async function startGame(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Morate biti prijavljeni za igranje" })
      return
    }

    // Kreiraj novu igru
    await query(
      `INSERT INTO games (user_id, score, questions_answered, completed, created_at)
       VALUES (?, 0, 0, false, NOW())`,
      [req.user.userId]
    )

    // Dohvati kreiranu igru
    const games = await query<GameSession>(
      "SELECT * FROM games WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
      [req.user.userId]
    )

    res.status(201).json({
      message: "Nova igra započeta",
      game: games[0],
    })
  } catch (error) {
    console.error("Greška pri pokretanju igre:", error)
    res.status(500).json({ error: "Interna greška servera" })
  }
}

// PUT /api/games/:id - azuriraj igru
export async function updateGame(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Niste autentifikovani" })
      return
    }

    const gameId = parseInt(req.params.id, 10)
    const { score, questions_answered, completed } = req.body

    // Provjeri da li igra pripada korisniku
    const games = await query<GameSession>("SELECT * FROM games WHERE id = ? AND user_id = ?", [gameId, req.user.userId])

    if (games.length === 0) {
      res.status(404).json({ error: "Igra nije pronađena" })
      return
    }

    // azuuriraj igru
    const updates: string[] = []
    const params: any[] = []

    if (score !== undefined) {
      updates.push("score = ?")
      params.push(score)
    }
    if (questions_answered !== undefined) {
      updates.push("questions_answered = ?")
      params.push(questions_answered)
    }
    if (completed !== undefined) {
      updates.push("completed = ?")
      params.push(completed)
      if (completed) {
        updates.push("finished_at = NOW()")
      }
    }

    if (updates.length > 0) {
      params.push(gameId)
      await query(`UPDATE games SET ${updates.join(", ")} WHERE id = ?`, params)
    }

    // Dohvati azuriranuy igru
    const updatedGames = await query<GameSession>("SELECT * FROM games WHERE id = ?", [gameId])

    res.json({
      message: "Igra ažurirana",
      game: updatedGames[0],
    })
  } catch (error) {
    console.error("Greška pri ažuriranju igre:", error)
    res.status(500).json({ error: "Interna greška servera" })
  }
}

// POST /api/quiz/quit - odustani od igre
export async function quitGame(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Niste autentifikovani" })
      return
    }

    const { game_id, score, questions_answered } = req.body

    // Ažuriraj igru kao završenu
    await query(
      `UPDATE games 
       SET score = ?, questions_answered = ?, completed = true, finished_at = NOW()
       WHERE id = ? AND user_id = ?`,
      [score, questions_answered, game_id, req.user.userId]
    )

    res.json({ message: "Igra završena" })
  } catch (error) {
    console.error("Greška pri odustajanju od igre:", error)
    res.status(500).json({ error: "Interna greška servera" })
  }
}

// GET /api/games - Lista igara
export async function getGames(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { user_id, limit = "10" } = req.query
    const limitNum = Math.max(1, Math.min(100, parseInt(limit as string, 10) || 10))

    let games: GameWithUser[]

    if (user_id) {
      // Igre za određenog korisnika
      games = await query<GameWithUser>(
        `SELECT g.*, u.username
         FROM games g
         JOIN users u ON g.user_id = u.id
         WHERE g.user_id = ?
         ORDER BY g.created_at DESC
         LIMIT ?`,
        [parseInt(user_id as string, 10), limitNum]
      )
    } else {
      // Leaderboard - top rezultati
      games = await query<GameWithUser>(
        `SELECT g.*, u.username
         FROM games g
         JOIN users u ON g.user_id = u.id
         WHERE g.completed = true
         ORDER BY g.score DESC, g.finished_at ASC
         LIMIT ?`,
        [limitNum]
      )
    }

    res.json({ games })
  } catch (error) {
    console.error("Greška pri dohvaćanju igara:", error)
    res.status(500).json({ error: "Interna greška servera" })
  }
}

// GET /api/games/:id - Detalji igre
export async function getGameById(req: AuthRequest, res: Response): Promise<void> {
  try {
    const gameId = parseInt(req.params.id, 10)

    const games = await query<GameWithUser>(
      `SELECT g.*, u.username
       FROM games g
       JOIN users u ON g.user_id = u.id
       WHERE g.id = ?`,
      [gameId]
    )

    if (games.length === 0) {
      res.status(404).json({ error: "Igra nije pronađena" })
      return
    }

    res.json({ game: games[0] })
  } catch (error) {
    console.error("Greška pri dohvaćanju igre:", error)
    res.status(500).json({ error: "Interna greška servera" })
  }
}
