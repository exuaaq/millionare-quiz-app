// ============================================
// TYPES
// ============================================
// Globalni TypeScript tipovi
// ============================================

export interface SafeUser {
  id: number
  username: string
  email: string
  created_at: Date
}

export interface Question {
  id: number
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer?: "A" | "B" | "C" | "D"
  difficulty: number
  category: string
  created_at?: Date
  updated_at?: Date
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

export interface GameSession {
  id: number
  user_id: number
  score: number
  questions_answered: number
  completed: boolean
  finished_at: Date | null
  created_at: Date
}

export interface GameWithUser extends GameSession {
  username: string
}
