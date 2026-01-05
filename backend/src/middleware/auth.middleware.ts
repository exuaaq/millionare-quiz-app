// ============================================
// AUTH MIDDLEWARE
// ============================================
// JWT autentifikacija middleware
// ============================================

import { Request, Response, NextFunction } from "express"
import { verifyToken } from "../utils/jwt.utils"

// Extend Express Request type
export interface AuthRequest extends Request {
  user?: {
    userId: number
    email: string
  }
}

// MIddleware za provjeru JWT tokena
export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  try {
    // Dohvati token iz Authorization headera
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Niste autentifikovani" })
      return
    }

    const token = authHeader.substring(7) // Ukloni "Bearer " prefix

    // Verifikuj token
    const payload = verifyToken(token)

    // Dodaj korisnicke podatke u request
    req.user = {
      userId: payload.userId,
      email: payload.email,
    }

    next()
  } catch (error) {
    res.status(401).json({ error: "Token nije validan ili je istekao" })
  }
}
