"use client"

// ============================================
// AUTH CONTEXT - JWT verzija
// ============================================
// Globalni state za autentifikaciju sa JWT tokenom
// ============================================

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import * as authApi from "../api/auth.api"
import type { SafeUser } from "../types"

interface AuthContextType {
  user: SafeUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Dohvaćanje trenutnog korisnika pri učitavanju
  const refreshUser = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        setUser(null)
        setLoading(false)
        return
      }

      const data = await authApi.getCurrentUser()
      setUser(data.user)
    } catch (error) {
      console.error("Failed to fetch user:", error)
      setUser(null)
      localStorage.removeItem("auth_token")
    } finally {
      setLoading(false)
    }
  }

  // Inicijalno učitavanje korisnika
  useEffect(() => {
    refreshUser()
  }, [])

  // Funkcija za prijavu
  const login = async (email: string, password: string) => {
    try {
      const data = await authApi.login({ email, password })
      
      // Sačuvaj token i korisnika
      localStorage.setItem("auth_token", data.token)
      setUser(data.user)
      
      return { success: true }
    } catch (error: any) {
      const message = error.response?.data?.error || "Greška pri prijavi"
      return { success: false, error: message }
    }
  }

  // Funkcija za registraciju
  const register = async (username: string, email: string, password: string) => {
    try {
      const data = await authApi.register({ username, email, password })
      
      // Automatska prijava nakon registracije
      localStorage.setItem("auth_token", data.token)
      setUser(data.user)
      
      return { success: true }
    } catch (error: any) {
      const message = error.response?.data?.error || "Greška pri registraciji"
      return { success: false, error: message }
    }
  }

  // Funkcija za odjavu
  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("auth_token")
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook za korištenje auth konteksta
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth mora biti korišten unutar AuthProvider-a")
  }
  return context
}
