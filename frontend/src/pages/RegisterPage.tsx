// ============================================
// REGISTER PAGE - Stranica za registraciju
// ============================================

import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { useEffect } from "react"
import { RegisterForm } from "@/components/register-form"
import { Header } from "@/components/header"

export default function RegisterPage() {
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

  const handleSwitchToLogin = () => {
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <RegisterForm onSuccess={handleSuccess} onSwitchToLogin={handleSwitchToLogin} />
        </div>
      </main>
    </div>
  )
}
