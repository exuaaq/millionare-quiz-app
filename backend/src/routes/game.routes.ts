// ============================================
// ROUTES: Games
// ============================================
// Rute za igre
// ============================================

import { Router } from "express"
import * as gameController from "../controllers/game.controller"
import { authMiddleware } from "../middleware/auth.middleware"

const router = Router()

// GET /api/games - Lista igara
router.get("/", gameController.getGames)

// GET /api/games/:id - Detalji igre
router.get("/:id", gameController.getGameById)

// PUT /api/games/:id - Azuriraj igru (zaštićeno)
router.put("/:id", authMiddleware, gameController.updateGame)

export default router
