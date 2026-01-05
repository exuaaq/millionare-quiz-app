// ============================================
// ADMIN API
// ============================================
// API pozivi za admin funkcionalnosti
// ============================================

import { apiClient } from "./axios.config"

export interface CreateQuestionDTO {
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: "A" | "B" | "C" | "D"
  difficulty: number
  category?: string
}

export interface UpdateQuestionDTO {
  question_text?: string
  option_a?: string
  option_b?: string
  option_c?: string
  option_d?: string
  correct_answer?: "A" | "B" | "C" | "D"
  difficulty?: number
  category?: string
}

// Kreiranje pitanja
export async function createQuestion(data: CreateQuestionDTO) {
  const response = await apiClient.post("/admin/questions", data)
  return response.data
}

// azuriranje pitanja
export async function updateQuestion(questionId: number, data: UpdateQuestionDTO) {
  const response = await apiClient.put(`/admin/questions/${questionId}`, data)
  return response.data
}

// Brisanje pitanja
export async function deleteQuestion(questionId: number) {
  const response = await apiClient.delete(`/admin/questions/${questionId}`)
  return response.data
}
