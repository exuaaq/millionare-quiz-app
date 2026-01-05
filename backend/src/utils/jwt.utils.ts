// ============================================
// JWT UTILITIES
// ============================================
// Funkcije za kreiranje i verifikaciju JWT tokena
// ============================================

import jwt from "jsonwebtoken"
import { config } from "../config/env"

export interface JWTPayload {
  userId: number
  email: string
}

// Kreiranje JWT tokena
export function createToken(payload: JWTPayload): string {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: "7d", // Token važi 7 dana
  })
}

// Verifikacija JWT tokena
export function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, config.JWT_SECRET) as JWTPayload
  } catch (error) {
    throw new Error("Invalid or expired token")
  }
}
