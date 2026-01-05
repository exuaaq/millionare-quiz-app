// ============================================
// MODEL: Question (Pitanje)
// ============================================
// Definicija TypeScript tipova za pitanja
// ============================================

export interface Question {
  id: number
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: "A" | "B" | "C" | "D"
  difficulty: number
  category: string
  created_at: Date
  updated_at: Date
}

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

export interface QuestionForPlayer {
  id: number
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  difficulty: number
  category: string
}
