"use client"

// ============================================
// QUIZ GAME - Glavna komponenta za kviz
// ============================================
// Upravlja tokom igre, pitanjima i rezultatima
// ============================================

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trophy, X, Check, LogOut, Loader2 } from "lucide-react"
import type { QuestionForPlayer } from "@/types"
import { PRIZE_LADDER, SAFE_HAVENS } from "@/lib/constants/game-constants"
import * as quizApi from "@/api/quiz.api"
import * as gameApi from "@/api/game.api"

interface QuizGameProps {
  gameId: number
  onGameEnd: (score: number, questionsAnswered: number) => void
}

type GameState = "playing" | "correct" | "wrong" | "won" | "quit"

export function QuizGame({ gameId, onGameEnd }: QuizGameProps) {
  // State za igru
  const [currentLevel, setCurrentLevel] = useState(1)
  const [question, setQuestion] = useState<QuestionForPlayer | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [gameState, setGameState] = useState<GameState>("playing")
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState("")

  // Formatiranje novčanog iznosa
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("bs-BA", {
      style: "currency",
      currency: "BAM",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Dohvaćanje pitanja za trenutni nivo
  const fetchQuestion = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const data = await quizApi.getRandomQuestion(currentLevel)
      setQuestion(data.question)
      setSelectedAnswer(null)
      setGameState("playing")
    } catch (err: any) {
      setError(err.response?.data?.error || "Greška pri učitavanju pitanja")
    } finally {
      setLoading(false)
    }
  }, [currentLevel])

  // Učitavanje prvog pitanja
  useEffect(() => {
    fetchQuestion()
  }, [fetchQuestion])

  // Provjera odgovora
  const checkAnswer = async () => {
    if (!selectedAnswer || !question) return

    setChecking(true)
    try {
      const data = await quizApi.checkAnswer(question.id, selectedAnswer)

      if (data.is_correct) {
        // Tačan odgovor
        setGameState("correct")

        // Ažuriranje igre u bazi
        await gameApi.updateGame(gameId, {
          score: PRIZE_LADDER[currentLevel],
          questions_answered: currentLevel,
          completed: currentLevel === 15,
        })

        if (currentLevel === 15) {
          // Pobijedio!
          setGameState("won")
          setTimeout(() => {
            onGameEnd(PRIZE_LADDER[15], 15)
          }, 2000)
        } else {
          // Prelazak na sljedeći nivo
          setTimeout(() => {
            setCurrentLevel((prev) => prev + 1)
          }, 1500)
        }
      } else {
        // Netačan odgovor
        setGameState("wrong")

        // Izračunavanje sigurne sume
        let safeScore = 0
        if (currentLevel >= 11) safeScore = SAFE_HAVENS[2]  // Third safe haven (questions 11+)
        else if (currentLevel >= 6) safeScore = SAFE_HAVENS[1]  // Second safe haven (questions 6-10)

        // Ažuriranje igre u bazi
        await gameApi.updateGame(gameId, {
          score: safeScore,
          questions_answered: currentLevel - 1,
          completed: true,
        })

        setTimeout(() => {
          onGameEnd(safeScore, currentLevel - 1)
        }, 2000)
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Greška pri provjeri odgovora")
    } finally {
      setChecking(false)
    }
  }

  // Odustajanje od igre
  const handleQuit = async () => {
    const currentScore = currentLevel > 1 ? PRIZE_LADDER[currentLevel - 1] : 0

    await gameApi.updateGame(gameId, {
      score: currentScore,
      questions_answered: currentLevel - 1,
      completed: true,
    })

    setGameState("quit")
    setTimeout(() => {
      onGameEnd(currentScore, currentLevel - 1)
    }, 1500)
  }

  // Boja dugmeta za odgovor
  const getAnswerButtonClass = (option: string) => {
    if (gameState === "playing") {
      return selectedAnswer === option
        ? "border-amber-500 bg-amber-50 dark:bg-amber-950/30"
        : "hover:border-amber-300 hover:bg-amber-50/50 dark:hover:bg-amber-950/20"
    }
    if (gameState === "correct" || gameState === "wrong") {
      if (option === selectedAnswer) {
        return gameState === "correct"
          ? "border-green-500 bg-green-50 dark:bg-green-950/30"
          : "border-red-500 bg-red-50 dark:bg-red-950/30"
      }
    }
    return ""
  }

  if (loading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="py-12">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            <p className="text-muted-foreground">Učitavanje pitanja...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="py-12">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={fetchQuestion} className="mt-4 w-full">
            Pokušaj ponovo
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Status bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="text-lg font-bold">
            Pitanje <span className="text-amber-500">{currentLevel}</span>/15
          </div>
          <div className="text-sm text-muted-foreground">Kategorija: {question?.category}</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-lg">
            Za: <span className="font-bold text-amber-600">{formatMoney(PRIZE_LADDER[currentLevel])}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleQuit}
            disabled={gameState !== "playing"}
            className="gap-1 bg-transparent"
          >
            <LogOut className="h-4 w-4" />
            Odustani
          </Button>
        </div>
      </div>

      {/* Pitanje */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl leading-relaxed">{question?.question_text}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Odgovor A */}
          <Button
            variant="outline"
            className={`h-auto py-4 px-6 text-left justify-start ${getAnswerButtonClass("A")}`}
            onClick={() => gameState === "playing" && setSelectedAnswer("A")}
            disabled={gameState !== "playing"}
          >
            <span className="font-bold mr-2 text-amber-600">A:</span>
            {question?.option_a}
          </Button>

          {/* Odgovor B */}
          <Button
            variant="outline"
            className={`h-auto py-4 px-6 text-left justify-start ${getAnswerButtonClass("B")}`}
            onClick={() => gameState === "playing" && setSelectedAnswer("B")}
            disabled={gameState !== "playing"}
          >
            <span className="font-bold mr-2 text-amber-600">B:</span>
            {question?.option_b}
          </Button>

          {/* Odgovor C */}
          <Button
            variant="outline"
            className={`h-auto py-4 px-6 text-left justify-start ${getAnswerButtonClass("C")}`}
            onClick={() => gameState === "playing" && setSelectedAnswer("C")}
            disabled={gameState !== "playing"}
          >
            <span className="font-bold mr-2 text-amber-600">C:</span>
            {question?.option_c}
          </Button>

          {/* Odgovor D */}
          <Button
            variant="outline"
            className={`h-auto py-4 px-6 text-left justify-start ${getAnswerButtonClass("D")}`}
            onClick={() => gameState === "playing" && setSelectedAnswer("D")}
            disabled={gameState !== "playing"}
          >
            <span className="font-bold mr-2 text-amber-600">D:</span>
            {question?.option_d}
          </Button>
        </CardContent>
      </Card>

      {/* Potvrda odgovora */}
      {gameState === "playing" && (
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={checkAnswer}
            disabled={!selectedAnswer || checking}
            className="min-w-[200px] gap-2"
          >
            {checking ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Provjera...
              </>
            ) : (
              "Potvrdi odgovor"
            )}
          </Button>
        </div>
      )}

      {/* Feedback poruke */}
      {gameState === "correct" && (
        <Alert className="bg-green-50 dark:bg-green-950/30 border-green-500">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600 font-medium">
            Tačno! Osvojili ste {formatMoney(PRIZE_LADDER[currentLevel])}
          </AlertDescription>
        </Alert>
      )}

      {gameState === "wrong" && (
        <Alert className="bg-red-50 dark:bg-red-950/30 border-red-500">
          <X className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-600 font-medium">
            Nažalost, netačan odgovor!{" "}
            {currentLevel <= 5 ? (
              <>Niste stigli do prve sigurne tačke (pitanje 5). Osvojili ste: 0 BAM</>
            ) : currentLevel <= 10 ? (
              <>Osvojili ste sigurnu sumu: {formatMoney(SAFE_HAVENS[1])} (sigurna tačka na pitanju 5)</>
            ) : (
              <>Osvojili ste sigurnu sumu: {formatMoney(SAFE_HAVENS[2])} (sigurna tačka na pitanju 10)</>
            )}
          </AlertDescription>
        </Alert>
      )}

      {gameState === "won" && (
        <Alert className="bg-amber-50 dark:bg-amber-950/30 border-amber-500">
          <Trophy className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-600 font-bold text-lg">
            ČESTITAMO! Osvojili ste MILION BAM!
          </AlertDescription>
        </Alert>
      )}

      {gameState === "quit" && (
        <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-500">
          <LogOut className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-600 font-medium">
            Odustali ste. Nosite kući: {formatMoney(currentLevel > 1 ? PRIZE_LADDER[currentLevel - 1] : 0)}
          </AlertDescription>
        </Alert>
      )}

      {/* Piramida nagrada - bočni prikaz */}
      <Card className="mt-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-500" />
            Piramida nagrada
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-1 text-xs">
            {PRIZE_LADDER.slice(1)
              .reverse()
              .map((prize, index) => {
                const level = 15 - index
                const isCurrent = level === currentLevel
                const isCompleted = level < currentLevel
                const isSafe = SAFE_HAVENS.includes(prize)

                return (
                  <div
                    key={level}
                    className={`text-center py-1 px-1 rounded ${
                      isCurrent
                        ? "bg-amber-500 text-white font-bold"
                        : isCompleted
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          : isSafe
                            ? "bg-amber-100 dark:bg-amber-900/20"
                            : "bg-muted"
                    }`}
                  >
                    <div className="font-medium">{level}</div>
                    <div className="truncate">{formatMoney(prize).replace("KM", "")}</div>
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
