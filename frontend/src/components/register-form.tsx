"use client"

import type React from "react"

// ============================================
// REGISTER FORM - Forma za registraciju
// ============================================
// Omogućava kreiranje novog korisničkog računa
// ============================================

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

interface RegisterFormProps {
  onSuccess?: () => void
  onSwitchToLogin?: () => void
}

export function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  // State za formu
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { register } = useAuth()

  // Handler za submit forme
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validacija lozinki
    if (password !== confirmPassword) {
      setError("Lozinke se ne podudaraju")
      return
    }

    if (password.length < 6) {
      setError("Lozinka mora imati najmanje 6 karaktera")
      return
    }

    setIsLoading(true)

    const result = await register(username, email, password)

    if (result.success) {
      onSuccess?.()
    } else {
      setError(result.error || "Greška pri registraciji")
    }

    setIsLoading(false)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Registracija</CardTitle>
        <CardDescription>Kreirajte novi račun za igranje</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Prikaz greške */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Korisničko ime */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="username">Korisničko ime</Label>
            <Input
              id="username"
              type="text"
              placeholder="vaše_ime"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {/* Email polje */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="vas@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {/* Lozinka polje */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Lozinka</Label>
            <Input
              id="password"
              type="password"
              placeholder="Minimalno 6 karaktera"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {/* Potvrda lozinke */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmPassword">Potvrdite lozinku</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Ponovite lozinku"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {/* Submit dugme */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registracija u toku...
              </>
            ) : (
              "Registruj se"
            )}
          </Button>

          {/* Link za prijavu */}
          {onSwitchToLogin && (
            <p className="text-center text-sm text-muted-foreground">
              Već imate račun?{" "}
              <button type="button" onClick={onSwitchToLogin} className="text-primary hover:underline">
                Prijavite se
              </button>
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
