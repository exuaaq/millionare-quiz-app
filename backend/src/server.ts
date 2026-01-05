// ============================================
// EXPRESS SERVER - Backend aplikacija
// ============================================
// Glavni server fajl sa Express.js
// ============================================

import express, { Application } from "express"
import cors from "cors"
import { config } from "./config/env"
import { initializeDatabase, closeDatabase } from "./config/database"
import { errorMiddleware } from "./middleware/error.middleware"

// Import routes
import authRoutes from "./routes/auth.routes"
import quizRoutes from "./routes/quiz.routes"
import userRoutes from "./routes/user.routes"
import adminRoutes from "./routes/admin.routes"
import leaderboardRoutes from "./routes/leaderboard.routes"
import gameRoutes from "./routes/game.routes"

const app: Application = express()

// ============================================
// MIDDLEWARE
// ============================================

// CORS konfiguracija
app.use(
  cors({
    origin: config.CORS_ORIGIN,
    credentials: true,
  })
)

// Body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Request logging
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})

// ============================================
// ROUTES
// ============================================

app.get("/", (_req, res) => {
  res.json({
    message: "Millionaire Quiz API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      quiz: "/api/quiz",
      users: "/api/users",
      admin: "/api/admin",
      leaderboard: "/api/leaderboard",
      games: "/api/games",
    },
  })
})

// API routes
app.use("/api/auth", authRoutes)
app.use("/api/quiz", quizRoutes)
app.use("/api/users", userRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/leaderboard", leaderboardRoutes)
app.use("/api/games", gameRoutes)

// Error handling middleware
app.use(errorMiddleware)


// SERVER START


async function startServer() {
  try {
    // Initialize database connection
    await initializeDatabase()

    // Start server
    app.listen(config.PORT, () => {
      console.log(`\n🚀 Server running on port ${config.PORT}`)
      console.log(`📝 Environment: ${config.NODE_ENV}`)
      console.log(`🌐 CORS Origin: ${config.CORS_ORIGIN}`)
      console.log(`\n✅ Backend ready!\n`)
    })
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n⏹️  Shutting down server...")
  await closeDatabase()
  process.exit(0)
})

process.on("SIGTERM", async () => {
  console.log("\n⏹️  Shutting down server...")
  await closeDatabase()
  process.exit(0)
})

// Start the server
startServer()
