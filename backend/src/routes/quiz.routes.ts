// ============================================
// ROUTES: Quiz
// ============================================
// Rute za quiz pitanja
// ============================================

import { Router } from "express"
import * as quizController from "../controllers/quiz.controller"
import * as gameController from "../controllers/game.controller"
import { authMiddleware } from "../middleware/auth.middleware"

const router = Router()

// GET /api/quiz/questions - Sva pitanja (protected)
router.get("/questions", authMiddleware, quizController.getAllQuestions)

// GET /api/quiz/random - Random pitanje (protected)
router.get("/random", authMiddleware, quizController.getRandomQuestion)

// POST /api/quiz/answer - Provjera odgovora (protected)
router.post("/answer", authMiddleware, quizController.checkAnswer)

// POST /api/quiz/start - Zapocni novu igru (protected)
router.post("/start", authMiddleware, gameController.startGame)

// POST /api/quiz/quit - Odustani od igre (protected)
router.post("/quit", authMiddleware, gameController.quitGame)

export default router
