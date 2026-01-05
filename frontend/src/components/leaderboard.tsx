"use client"

// ============================================
// LEADERBOARD - Rang lista
// ============================================
// Prikazuje top igrače po osvojenim bodovima
// ============================================

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trophy, Medal } from "lucide-react"
import type { GameWithUser } from "@/types"
import * as leaderboardApi from "@/api/leaderboard.api"

export function Leaderboard() {
  const [games, setGames] = useState<GameWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Dohvaćanje top rezultata
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setError(null)
        const data = await leaderboardApi.getLeaderboard(10)
        setGames(data.games)
      } catch (error: any) {
        console.error("Greška pri učitavanju rang liste:", error)
        const errorMessage = error.response?.data?.error || error.message || "Greška pri učitavanju rang liste"
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  // Formatiranje novčanog iznosa
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("bs-BA", {
      style: "currency",
      currency: "BAM",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Ikona za top 3 pozicije
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-amber-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-700" />
      default:
        return <span className="text-muted-foreground">{rank}</span>
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex justify-center">
            <div className="animate-pulse text-muted-foreground">Učitavanje...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <p className="text-destructive font-medium mb-2">⚠️ Greška</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 text-sm text-primary hover:underline"
            >
              Pokušaj ponovo
            </button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          Rang lista - Top 10
        </CardTitle>
      </CardHeader>
      <CardContent>
        {games.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Još nema odigranih igara. Budite prvi!</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rang</TableHead>
                <TableHead>Igrač</TableHead>
                <TableHead className="text-right">Osvojeno</TableHead>
                <TableHead className="text-right hidden sm:table-cell">Pitanja</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {games.map((game, index) => (
                <TableRow key={game.id}>
                  <TableCell className="font-medium">{getRankIcon(index + 1)}</TableCell>
                  <TableCell>{game.username}</TableCell>
                  <TableCell className="text-right font-bold text-amber-600">{formatMoney(game.score)}</TableCell>
                  <TableCell className="text-right hidden sm:table-cell">{game.questions_answered}/15</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
