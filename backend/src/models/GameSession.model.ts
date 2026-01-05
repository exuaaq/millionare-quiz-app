// ============================================
// MODEL: GameSession (Igra)
// ============================================
// Definicija TypeScript tipova za igre
// ============================================

export interface GameSession {
  id: number
  user_id: number
  score: number
  questions_answered: number
  completed: boolean
  finished_at: Date | null
  created_at: Date
}

export interface CreateGameDTO {
  user_id: number
}

export interface UpdateGameDTO {
  score?: number
  questions_answered?: number
  completed?: boolean
  finished_at?: Date
}

export interface GameWithUser extends GameSession {
  username: string
}

// Game constants
export const PRIZE_LADDER: { [key: number]: number } = {
  1: 100,
  2: 200,
  3: 300,
  4: 500,
  5: 1000,
  6: 2000,
  7: 4000,
  8: 8000,
  9: 16000,
  10: 32000,
  11: 64000,
  12: 125000,
  13: 250000,
  14: 500000,
  15: 1000000,
}

export const SAFE_HAVENS = [5, 10]
