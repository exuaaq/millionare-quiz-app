// ============================================
// HOME PAGE - Početna stranica
// ============================================
// Prikazuje uvod u igru, pravila i rang listu
// ============================================

import { Header } from "@/components/header"
import { Leaderboard } from "@/components/leaderboard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, HelpCircle, Gamepad2, Star } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

export default function HomePage() {
  const { user } = useAuth()

  // Nagrade za svako pitanje
  const prizes = [
    { level: 1, amount: "100 KM" },
    { level: 2, amount: "200 KM" },
    { level: 3, amount: "300 KM" },
    { level: 4, amount: "500 KM" },
    { level: 5, amount: "1.000 KM", safe: true },
    { level: 6, amount: "2.000 KM" },
    { level: 7, amount: "4.000 KM" },
    { level: 8, amount: "8.000 KM" },
    { level: 9, amount: "16.000 KM" },
    { level: 10, amount: "32.000 KM", safe: true },
    { level: 11, amount: "64.000 KM" },
    { level: 12, amount: "125.000 KM" },
    { level: 13, amount: "250.000 KM" },
    { level: 14, amount: "500.000 KM" },
    { level: 15, amount: "1.000.000 KM", million: true },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero sekcija */}
      <section className="bg-gradient-to-b from-amber-50 to-background dark:from-amber-950/20 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <Trophy className="h-16 w-16 text-amber-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Ko želi biti milioner?</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
            Testirajte svoje znanje u popularnom kvizu sa 15 pitanja. Odgovorite tačno na sva pitanja i osvojite milion
            KM!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {user ? (
              <Button asChild size="lg" className="gap-2">
                <Link to="/play">
                  <Gamepad2 className="h-5 w-5" />
                  Započni igru
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="gap-2">
                  <Link to="/register">
                    <Star className="h-5 w-5" />
                    Registruj se i igraj
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/login">Već imaš račun? Prijavi se</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Pravila igre */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-blue-500" />
                Pravila igre
              </CardTitle>
              <CardDescription>Kako igrati kviz</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>1. Igra se sastoji od 15 pitanja rastuće težine.</p>
              <p>2. Svako pitanje ima 4 ponuđena odgovora (A, B, C, D).</p>
              <p>3. Tačan odgovor vas vodi na sljedeće pitanje sa većom nagradom.</p>
              <p>4. Netačan odgovor završava igru - padate na posljednju sigurnu sumu.</p>
              <p>
                5. <strong>Sigurne sume</strong> su na pitanjima 5 (1.000 KM) i 10 (32.000 KM).
              </p>
              <p>6. Možete odustati bilo kada i zadržati osvojeni novac.</p>
            </CardContent>
          </Card>

          {/* Piramida nagrada */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                Piramida nagrada
              </CardTitle>
              <CardDescription>Osvojite do milion KM!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {prizes
                  .slice()
                  .reverse()
                  .map((prize) => (
                    <div
                      key={prize.level}
                      className={`flex justify-between items-center px-3 py-1.5 rounded text-sm ${
                        prize.million
                          ? "bg-amber-500 text-white font-bold"
                          : prize.safe
                            ? "bg-amber-100 dark:bg-amber-900/30 font-semibold"
                            : "hover:bg-muted"
                      }`}
                    >
                      <span>Pitanje {prize.level}</span>
                      <span>{prize.amount}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rang lista */}
        <div className="mt-12">
          <Leaderboard />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Lingaguliguliguli</p>
          <p className="mt-1">Express + React | PostgreSQL/MySQL</p>
        </div>
      </footer>
    </div>
  )
}
