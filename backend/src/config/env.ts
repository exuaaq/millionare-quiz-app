// ============================================
// ENVIRONMENT CONFIGURATION
// ============================================
// Učitavanje i validacija environment varijabli
// ============================================

import dotenv from "dotenv"
import path from "path"

// ucitaj .env fajl
dotenv.config({ path: path.resolve(__dirname, "../../.env") })

interface EnvConfig {
  PORT: number
  JWT_SECRET: string
  NODE_ENV: string
  CORS_ORIGIN: string
  // MySQL konfiguracija
  MYSQL_HOST: string
  MYSQL_USER: string
  MYSQL_PASSWORD: string
  MYSQL_DATABASE: string
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`)
  }
  return value
}

export const config: EnvConfig = {
  PORT: parseInt(getEnvVar("PORT", "5000"), 10),
  JWT_SECRET: getEnvVar("JWT_SECRET"),
  NODE_ENV: getEnvVar("NODE_ENV", "development"),
  CORS_ORIGIN: getEnvVar("CORS_ORIGIN", "http://localhost:5173"),
  // MySQL konfiguracija
  MYSQL_HOST: getEnvVar("MYSQL_HOST"),
  MYSQL_USER: getEnvVar("MYSQL_USER"),
  MYSQL_PASSWORD: getEnvVar("MYSQL_PASSWORD"),
  MYSQL_DATABASE: getEnvVar("MYSQL_DATABASE"),
}
