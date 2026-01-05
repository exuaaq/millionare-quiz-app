// ============================================
// ROUTES: Auth
// ============================================
// Rute za autentifikaciju
// ============================================

import { Router } from "express"
import * as authController from "../controllers/auth.controller"
import { authMiddleware } from "../middleware/auth.middleware"

const router = Router()

// POST /api/auth/register - Registracija
router.post("/register", authController.register)

// POST /api/auth/login - Login
router.post("/login", authController.login)

// GET /api/auth/me - Trenutni korisnik (protected)
router.get("/me", authMiddleware, authController.getCurrentUser)

// POST /api/auth/logout - Logout
router.post("/logout", authController.logout)

export default router
