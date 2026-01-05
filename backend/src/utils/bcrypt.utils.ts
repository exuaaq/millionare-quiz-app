// ============================================
// BCRYPT UTILITIES
// ============================================
// Funkcije za hashovanje i verifikaciju lozinki
// ============================================

import bcrypt from "bcryptjs"

const SALT_ROUNDS = 10

// Hashovanje lozinke
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

// Verifikacija lozinke
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
