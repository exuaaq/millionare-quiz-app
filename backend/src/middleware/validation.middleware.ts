// ============================================
// VALIDATION MIDDLEWARE
// ============================================
// Zod validacija middleware
// ============================================

import { Request, Response, NextFunction } from "express"
import { ZodSchema } from "zod"

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body)
      next()
    } catch (error: any) {
      res.status(400).json({
        error: "Validaciona greška",
        details: error.errors,
      })
    }
  }
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.query)
      next()
    } catch (error: any) {
      res.status(400).json({
        error: "Validaciona greška",
        details: error.errors,
      })
    }
  }
}
