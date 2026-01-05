// ============================================
// CONTROLLER: Quiz
// ============================================
// Quiz pitanja i provjera odgovora
// ============================================

import { Response } from "express"
import { query } from "../config/database"
import type { Question, QuestionForPlayer } from "../models/Question.model"
import type { AuthRequest } from "../middleware/auth.middleware"

// GET /api/quiz/questions - Sva pitanja (admin)
export async function getAllQuestions(_req: AuthRequest, res: Response): Promise<void> {
  try {
    const questions = await query<Question>("SELECT * FROM questions ORDER BY difficulty, id")
    res.json({ questions })
  } catch (error) {
    console.error("Greška pri dohvaćanju pitanja:", error)
    res.status(500).json({ error: "Interna greška servera" })
  }
}

// GET /api/quiz/random - rand pitanje za nivo
export async function getRandomQuestion(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { difficulty } = req.query

    if (!difficulty) {
      res.status(400).json({ error: "Težina pitanja je obavezna" })
      return
    }

    const difficultyNum = parseInt(difficulty as string, 10)
    if (isNaN(difficultyNum) || difficultyNum < 1 || difficultyNum > 15) {
      res.status(400).json({ error: "Težina mora biti između 1 i 15" })
      return
    }

    // Dohvati random pitanje bez tacnog odgovora
    const questions = await query<QuestionForPlayer>(
      `SELECT id, question_text, option_a, option_b, option_c, option_d, difficulty, category
       FROM questions
       WHERE difficulty = ?
       ORDER BY RAND()
       LIMIT 1`,
      [difficultyNum]
    )

    if (questions.length === 0) {
      res.status(404).json({ error: "Nema dostupnih pitanja za ovu težinu" })
      return
    }

    res.json({ question: questions[0] })
  } catch (error) {
    console.error("Greška pri dohvaćanju random pitanja:", error)
    res.status(500).json({ error: "Interna greška servera" })
  }
}

// POST /api/quiz/answer - Provera odgovora
export async function checkAnswer(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { question_id, answer } = req.body

    if (!question_id || !answer) {
      res.status(400).json({ error: "ID pitanja i odgovor su obavezni" })
      return
    }

    // Dohvati pitanje
    const questions = await query<Question>("SELECT * FROM questions WHERE id = ?", [question_id])

    if (questions.length === 0) {
      res.status(404).json({ error: "Pitanje nije pronađeno" })
      return
    }

    const question = questions[0]
    const isCorrect = question.correct_answer === answer

    res.json({
      is_correct: isCorrect,
      correct_answer: question.correct_answer,
    })
  } catch (error) {
    console.error("Greška pri provjeri odgovora:", error)
    res.status(500).json({ error: "Interna greška servera" })
  }
}
