// ============================================
// CONTROLLER: Admin
// ============================================
// Admin funkcionalnosti (CRUD pitanja)
// ============================================

import { Response } from "express"
import { query } from "../config/database"
import type { Question, CreateQuestionDTO } from "../models/Question.model"
import type { AuthRequest } from "../middleware/auth.middleware"

// POST /api/admin/questions - Dodaj pitanje
export async function createQuestion(req: AuthRequest, res:  Response): Promise<void> {
  try {
    const { question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, category } =
        req. body as CreateQuestionDTO

    // Validacija
    if (! question_text || !option_a || !option_b || !option_c || !option_d || !correct_answer || !difficulty) {
      res.status(400).json({ error: "Sva obavezna polja moraju biti popunjena" })
      return
    }

    if (! ["A", "B", "C", "D"].includes(correct_answer)) {
      res.status(400).json({ error: "Tačan odgovor mora biti A, B, C ili D" })
      return
    }

    const difficultyNum = parseInt(String(difficulty), 10)
    if (isNaN(difficultyNum) || difficultyNum < 1 || difficultyNum > 15) {
      res.status(400).json({ error: "Težina mora biti broj između 1 i 15" })
      return
    }

    // Dodaj pitanje
    await query(
        `INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [question_text, option_a, option_b, option_c, option_d, correct_answer, difficultyNum, category || "Opšta kultura"]
    )

    // Dohvati novo kreirano pitanje
    const questions = await query<Question>(
        "SELECT * FROM questions WHERE question_text = ? ORDER BY created_at DESC LIMIT 1",
        [question_text]
    )

    res.status(201).json({
      message: "Pitanje uspješno dodato",
      question: questions[0],
    })
  } catch (error) {
    console.error("Greška pri dodavanju pitanja:", error)
    res.status(500).json({ error: "Interna greška servera" })
  }
}

// PUT /api/admin/questions/:id - Izmeni pitanje
export async function updateQuestion(req: AuthRequest, res: Response): Promise<void> {
  try {
    const questionId = parseInt(req.params. id, 10)
    const updates = req.body

    console.log("📝 Update request for question:", questionId)
    console.log("📝 Updates received:", updates)

    // Provjeri da li pitanje postoji
    const questions = await query<Question>("SELECT * FROM questions WHERE id = ?", [questionId])

    if (questions. length === 0) {
      res.status(404).json({ error: "Pitanje nije pronađeno" })
      return
    }

    // Ažuriraj pitanje
    const updateFields:  string[] = []
    const params: any[] = []

    if (updates.question_text !== undefined) {
      updateFields.push("question_text = ?")
      params.push(updates.question_text)
    }
    if (updates.option_a !== undefined) {
      updateFields. push("option_a = ? ")
      params.push(updates.option_a)
    }
    if (updates.option_b !== undefined) {
      updateFields.push("option_b = ?")
      params.push(updates.option_b)
    }
    if (updates.option_c !== undefined) {
      updateFields.push("option_c = ?")
      params.push(updates.option_c)
    }
    if (updates. option_d !== undefined) {
      updateFields.push("option_d = ?")
      params.push(updates.option_d)
    }
    if (updates.correct_answer !== undefined) {
      if (!["A", "B", "C", "D"]. includes(updates.correct_answer)) {
        res.status(400).json({ error: "Tačan odgovor mora biti A, B, C ili D" })
        return
      }
      updateFields.push("correct_answer = ?")
      params.push(updates.correct_answer)
    }
    if (updates. difficulty !== undefined) {
      const difficultyNum = parseInt(String(updates.difficulty), 10)
      console.log("📝 Difficulty value:", updates.difficulty, "-> parsed:", difficultyNum)

      if (isNaN(difficultyNum) || difficultyNum < 1 || difficultyNum > 15) {
        res.status(400).json({ error: "Težina mora biti broj između 1 i 15" })
        return
      }

      updateFields.push("difficulty = ?")
      params.push(difficultyNum) // ✅ Use the number directly, not enum
    }
    if (updates.category !== undefined) {
      updateFields.push("category = ? ")
      params.push(updates.category)
    }

    if (updateFields.length > 0) {
      params.push(questionId)
      const sqlQuery = `UPDATE questions SET ${updateFields.join(", ")} WHERE id = ?`
      console.log("📝 SQL Query:", sqlQuery)
      console.log("📝 Params:", params)

      await query(sqlQuery, params)
    }

    // Dohvati azurirano pitanje
    const updatedQuestions = await query<Question>("SELECT * FROM questions WHERE id = ? ", [questionId])

    res.json({
      message: "Pitanje uspješno ažurirano",
      question:  updatedQuestions[0],
    })
  } catch (error) {
    console.error("Greška pri ažuriranju pitanja:", error)
    res.status(500).json({ error: "Interna greška servera" })
  }
}

// DELETE /api/admin/questions/:id - brisanje pitanja
export async function deleteQuestion(req: AuthRequest, res: Response): Promise<void> {
  try {
    const questionId = parseInt(req.params. id, 10)

    // Provjeri da li pitanje postoji
    const questions = await query<Question>("SELECT * FROM questions WHERE id = ?", [questionId])

    if (questions.length === 0) {
      res.status(404).json({ error: "Pitanje nije pronađeno" })
      return
    }


    await query("DELETE FROM questions WHERE id = ?", [questionId])

    res.json({ message: "Pitanje uspješno obrisano" })
  } catch (error) {
    console.error("Greška pri brisanju pitanja:", error)
    res.status(500).json({ error: "Interna greška servera" })
  }
}