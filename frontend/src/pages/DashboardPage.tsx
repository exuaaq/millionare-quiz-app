// ============================================
// DASHBOARD PAGE - Korisnički dashboard
// ============================================

import { useEffect, useState, useCallback } from "react"
import { Header } from "@/components/header"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trophy, Gamepad2, Award, TrendingUp } from "lucide-react"
import * as userApi from "@/api/user.api"
import * as gameApi from "@/api/game.api"
import type { GameSession } from "@/types"

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [recentGames, setRecentGames] = useState<GameSession[]>([])
  const [loading, setLoading] = useState(true)

  const loadUserData = useCallback(async () => {
    if (!user) return

    try {
      const [statsData, gamesData] = await Promise.all([
        userApi.getUserStats(user.id),
        gameApi.getGames(user.id, 10),
      ])
      setStats(statsData.stats)
      setRecentGames(gamesData.games)
    } catch (error) {
      console.error("Error loading user data:", error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user, loadUserData])

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("bs-BA", {
      style: "currency",
      currency: "BAM",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Učitavanje...</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard - {user?.username}</h1>

        {/* Statistika */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ukupno igara</CardTitle>
              <Gamepad2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalGames || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Završene igre</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.completedGames || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Najbolji rezultat</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatMoney(stats?.bestScore || 0)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ukupno osvojeno</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatMoney(stats?.totalWinnings || 0)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Posljednje igre */}
        <Card>
          <CardHeader>
            <CardTitle>Posljednje igre</CardTitle>
            <CardDescription>Vaših posljednjih 10 igara</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Datum</TableHead>
                  <TableHead>Pitanja</TableHead>
                  <TableHead>Osvojeno</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentGames.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      Nema igara
                    </TableCell>
                  </TableRow>
                ) : (
                  recentGames.map((game) => (
                    <TableRow key={game.id}>
                      <TableCell>{new Date(game.created_at).toLocaleDateString("bs-BA")}</TableCell>
                      <TableCell>{game.questions_answered}</TableCell>
                      <TableCell>{formatMoney(game.score)}</TableCell>
                      <TableCell>
                        {game.completed ? (
                          <span className="text-green-600">Završena</span>
                        ) : (
                          <span className="text-yellow-600">U toku</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
