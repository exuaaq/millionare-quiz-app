// ============================================
// CONTROLLER: Auth
// ============================================
// Autentifikacija korisnika (login, register, logout)
// ============================================

import { Response } from "express"
import { query } from "../config/database"
import { hashPassword, comparePassword } from "../utils/bcrypt.utils"
import { createToken } from "../utils/jwt.utils"
import type { User, SafeUser } from "../models/User.model"
import type { AuthRequest } from "../middleware/auth.middleware"

// POST /api/auth/register
export async function register(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { username, email, password } = req.body

    // Validacija
    if (!username || !email || !password) {
      res.status(400).json({ error: "Sva polja su obavezna" })
      return
    }

    // Provjera da li korisnik vec postoji
    const existingUsers = await query<User>(
      "SELECT * FROM users WHERE email = ? OR username = ?",
      [email, username]
    )

    if (existingUsers.length > 0) {
      res.status(400).json({ error: "Korisnik sa ovim emailom ili korisničkim imenom već postoji" })
      return
    }

    // Hashovanje lozinke
    const passwordHash = await hashPassword(password)

    // Kreiranje novog korisnika
    await query<User>(
      `INSERT INTO users (username, email, password_hash, created_at, updated_at) 
       VALUES (?, ?, ?, NOW(), NOW())`,
      [username, email, passwordHash]
    )

    // Dohvati kreiranog korisnika
    const newUsers = await query<User>("SELECT * FROM users WHERE email = ?", [email])
    const newUser = newUsers[0]

    // Kreiranje JWT tokena
    const token = createToken({ userId: newUser.id, email: newUser.email })

    // vracanje korisnika i tokena
    const safeUser: SafeUser = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      created_at: newUser.created_at,
    }

    res.status(201).json({
      message: "Uspješna registracija",
      token,
      user: safeUser,
    })
  } catch (error) {
    console.error("Greška pri registraciji:", error)
    res.status(500).json({ error: "Interna greška servera" })
  }
}

// POST /api/auth/login
export async function login(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { email, password } = req.body

    // Validacija
    if (!email || !password) {
      res.status(400).json({ error: "Email i lozinka su obavezni" })
      return
    }

    // trazenje korisnika
    const users = await query<User>("SELECT * FROM users WHERE email = ?", [email])

    if (users.length === 0) {
      res.status(401).json({ error: "Pogrešan email ili lozinka" })
      return
    }

    const user = users[0]

    // Provjera lozinke
    const isValidPassword = await comparePassword(password, user.password_hash)
    if (!isValidPassword) {
      res.status(401).json({ error: "Pogrešan email ili lozinka" })
      return
    }

    // Kreiranje JWT tokena
    const token = createToken({ userId: user.id, email: user.email })

    // Vraćanje korisnika i tokena
    const safeUser: SafeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at,
    }

    res.json({
      message: "Uspješna prijava",
      token,
      user: safeUser,
    })
  } catch (error) {
    console.error("Greška pri prijavi:", error)
    res.status(500).json({ error: "Interna greška servera" })
  }
}

// GET /api/auth/me
export async function getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Niste autentifikovani" })
      return
    }

    // Dohvati korisnika iz baze
    const users = await query<User>("SELECT * FROM users WHERE id = ?", [req.user.userId])

    if (users.length === 0) {
      res.status(404).json({ error: "Korisnik nije pronađen" })
      return
    }

    const user = users[0]
    const safeUser: SafeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at,
    }

    res.json({ user: safeUser })
  } catch (error) {
    console.error("Greška pri dohvaćanju korisnika:", error)
    res.status(500).json({ error: "Interna greška servera" })
  }
}

// POST /api/auth/logout
export async function logout(_req: AuthRequest, res: Response): Promise<void> {
  // JWT logout se rješava na frontendu brisanjem tokena
  res.json({ message: "Uspješna odjava" })
}
