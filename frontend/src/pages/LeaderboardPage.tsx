// ============================================
// LEADERBOARD PAGE - Stranica sa rang listom
// ============================================

import { Header } from "@/components/header"
import { Leaderboard } from "@/components/leaderboard"

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Leaderboard />
        </div>
      </main>
    </div>
  )
}
