// ============================================
// PLAY PAGE - Stranica za igranje kviza
// ============================================

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Header } from "@/components/header"
import { QuizGame } from "@/components/quiz-game"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Gamepad2, Home, RotateCcw } from "lucide-react"
import { Link } from "react-router-dom"
import * as quizApi from "@/api/quiz.api"

type PageState = "loading" | "ready" | "playing" | "finished"

export default function PlayPage() {
  const { user, loading, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [pageState, setPageState] = useState<PageState>("loading")
  const [gameId, setGameId] = useState<number | null>(null)
  const [finalScore, setFinalScore] = useState(0)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)

  // Preusmjeravanje ako korisnik nije prijavljen
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login")
    } else if (!loading && user) {
      setPageState("ready")
    }
  }, [user, loading, navigate])

  // Započinjanje nove igre
  const startGame = async () => {
    try {
      const data = await quizApi.startGame()
      setGameId(data.game.id)
      setPageState("playing")
    } catch (error) {
      console.error("Greška pri pokretanju igre:", error)
    }
  }

  // Završetak igre
  const handleGameEnd = async (score: number, questions: number) => {
    setFinalScore(score)
    setQuestionsAnswered(questions)
    setPageState("finished")
    // Osvježi korisničke podatke da se dashboard ažurira
    await refreshUser()
  }

  // Formatiranje novčanog iznosa
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("bs-BA", {
      style: "currency",
      currency: "BAM",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loading || pageState === "loading") {
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
        {/* Ekran za početak igre */}
        {pageState === "ready" && (
          <Card className="max-w-md mx-auto text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Gamepad2 className="h-16 w-16 text-amber-500" />
              </div>
              <CardTitle className="text-2xl">Spremni za igru?</CardTitle>
              <CardDescription>
                Odgovorite tačno na 15 pitanja i osvojite milion KM! Sretno, {user?.username}!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={startGame} size="lg" className="w-full gap-2">
                <Gamepad2 className="h-5 w-5" />
                Započni igru
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Igra u toku */}
        {pageState === "playing" && gameId && <QuizGame gameId={gameId} onGameEnd={handleGameEnd} />}

        {/* Ekran za završetak igre */}
        {pageState === "finished" && (
          <Card className="max-w-md mx-auto text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Trophy className="h-16 w-16 text-amber-500" />
              </div>
              <CardTitle className="text-2xl">
                {finalScore >= 1000000 ? "ČESTITAMO!" : finalScore > 0 ? "Igra završena!" : "Nažalost..."}
              </CardTitle>
              <CardDescription>
                {finalScore >= 1000000
                  ? "Osvojili ste MILION KM!"
                  : finalScore > 0
                    ? `Tačno ste odgovorili na ${questionsAnswered} pitanja`
                    : "Niste osvojili ništa. Pokušajte ponovo!"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold text-amber-600">{formatMoney(finalScore)}</div>
              <div className="flex flex-col gap-2">
                <Button onClick={startGame} size="lg" className="w-full gap-2">
                  <RotateCcw className="h-5 w-5" />
                  Nova igra
                </Button>
                <Button asChild variant="outline" className="w-full gap-2 bg-transparent">
                  <Link to="/dashboard">
                    <Home className="h-5 w-5" />
                    Povratak na dashboard
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
