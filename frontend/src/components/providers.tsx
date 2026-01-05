"use client"


// PROVIDERS - Wrapper za sve provider komponente

// Omogucva koristenje client-side providera u server layout-u


import type { ReactNode } from "react"
import { AuthProvider } from "@/context/AuthContext"

export function Providers({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
