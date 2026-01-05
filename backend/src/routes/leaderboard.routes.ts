// ============================================
// ROUTES: Leaderboard
// ============================================
// Rute za rang listu
// ============================================

import { Router } from "express"
import * as leaderboardController from "../controllers/leaderboard.controller"

const router = Router()

// GET /api/leaderboard - Top igraci
router.get("/", leaderboardController.getLeaderboard)

// GET /api/leaderboard/recent - recent igre
router.get("/recent", leaderboardController.getRecentGames)

export default router
