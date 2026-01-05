// ============================================
// LOGIN PAGE - Stranica za prijavu
// ============================================

import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { useEffect } from "react"
import { LoginForm } from "@/components/login-form"
import { Header } from "@/components/header"

export default function LoginPage() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  // Preusmjeravanje ako je korisnik već prijavljen
  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard")
    }
  }, [user, loading, navigate])

  const handleSuccess = () => {
    navigate("/dashboard")
  }

  const handleSwitchToRegister = () => {
    navigate("/register")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <LoginForm onSuccess={handleSuccess} onSwitchToRegister={handleSwitchToRegister} />
        </div>
      </main>
    </div>
  )
}
