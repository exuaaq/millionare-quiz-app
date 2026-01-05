// ============================================
// ERROR MIDDLEWARE
// ============================================
// Centralizovano rukovanje greškama
// ============================================

import { Request, Response, NextFunction } from "express"

export function errorMiddleware(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  console.error("Error:", err)

  // genericki error
  const statusCode = (err as any).statusCode || 500
  const message = err.message || "Interna greška servera"

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
}
