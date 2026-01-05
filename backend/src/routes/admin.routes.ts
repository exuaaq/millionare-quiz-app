// ============================================
// ROUTES: Admin
// ============================================
// Rute za admin funkcionalnosti
// ============================================

import { Router } from "express"
import * as adminController from "../controllers/admin.controller"
import { authMiddleware } from "../middleware/auth.middleware"

const router = Router()

// POST /api/admin/questions - Dodaj pitanje (protected)
router.post("/questions", authMiddleware, adminController.createQuestion)

// PUT /api/admin/questions/:id - Izmeni pitanje (protected)
router.put("/questions/:id", authMiddleware, adminController.updateQuestion)

// DELETE /api/admin/questions/:id - Obriši pitanje (protected)
router.delete("/questions/:id", authMiddleware, adminController.deleteQuestion)

export default router
