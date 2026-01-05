// ============================================
// QUIZ API
// ============================================
// API pozivi za quiz funkcionalnosti
// ============================================

import { apiClient } from "./axios.config"

export interface Question {
  id: number
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  difficulty: number
  category: string
}

export interface AnswerCheckResponse {
  is_correct: boolean
  correct_answer: "A" | "B" | "C" | "D"
}

// Dohvat svih pitanja (admin)
export async function getAllQuestions() {
  const response = await apiClient.get("/quiz/questions")
  return response.data
}

// Dohvat random pitanja za odredjenu tezinu
export async function getRandomQuestion(difficulty: number) {
  const response = await apiClient.get(`/quiz/random?difficulty=${difficulty}`)
  return response.data
}

// Provjera odgovora
export async function checkAnswer(questionId: number, answer: string): Promise<AnswerCheckResponse> {
  const response = await apiClient.post("/quiz/answer", {
    question_id: questionId,
    answer,
  })
  return response.data
}

// pocni novu igru
export async function startGame() {
  const response = await apiClient.post("/quiz/start")
  return response.data
}

// Odustani od igre
export async function quitGame(gameId: number, score: number, questionsAnswered: number) {
  const response = await apiClient.post("/quiz/quit", {
    game_id: gameId,
    score,
    questions_answered: questionsAnswered,
  })
  return response.data
}
