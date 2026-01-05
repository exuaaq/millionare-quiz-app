// ============================================
// ROUTES: User
// ============================================
// Rute za korisnike
// ============================================

import { Router } from "express"
import * as userController from "../controllers/user.controller"
import { authMiddleware } from "../middleware/auth.middleware"

const router = Router()

// GET /api/users - Lista svih korisnika (protected)
router.get("/", authMiddleware, userController.getAllUsers)

// GET /api/users/:id - User profil (protected)
router.get("/:id", authMiddleware, userController.getUserById)

// GET /api/users/:id/stats - Statistika korisnika (protected)
router.get("/:id/stats", authMiddleware, userController.getUserStats)

export default router
