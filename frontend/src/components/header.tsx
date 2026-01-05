"use client"

// ============================================
// HEADER - Navigacijska traka
// ============================================
// Prikazuje logo, navigaciju i korisničke opcije
// ============================================

import { Link } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Trophy, User, LogOut, Settings, Home, Gamepad2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const { user, logout, loading } = useAuth()

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo i naziv */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <Trophy className="h-6 w-6 text-amber-500" />
          <span className="text-balance">Ko želi biti milioner?</span>
        </Link>

        {/* Navigacija */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition">
            <Home className="h-4 w-4" />
            Početna
          </Link>
          <Link
            to="/leaderboard"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition"
          >
            <Trophy className="h-4 w-4" />
            Rang lista
          </Link>
          {user && (
            <Link
              to="/play"
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition"
            >
              <Gamepad2 className="h-4 w-4" />
              Igraj
            </Link>
          )}
        </nav>

        {/* Korisničke opcije */}
        <div className="flex items-center gap-4">
          {loading ? (
            <div className="h-10 w-24 animate-pulse bg-muted rounded" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user.username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin" className="flex items-center gap-2 cursor-pointer">
                    <Settings className="h-4 w-4" />
                    Admin panel
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="flex items-center gap-2 cursor-pointer text-destructive">
                  <LogOut className="h-4 w-4" />
                  Odjavi se
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Prijava</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Registracija</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
