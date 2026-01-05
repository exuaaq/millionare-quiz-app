// ============================================
// DATABASE CONNECTION - MySQL
// ============================================
// MySQL database connection
// ============================================

import mysql from "mysql2/promise"
import { config } from "./env"

// MySQL connection pool
let mysqlPool: mysql.Pool | null = null

// Inicijalizacija MySQL konekcije
export async function initializeDatabase() {
  mysqlPool = mysql.createPool({
    host: config.MYSQL_HOST,
    user: config.MYSQL_USER,
    password: config.MYSQL_PASSWORD,
    database: config. MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  })
  console.log("✓ Connected to MySQL database")
}

// Query function za MySQL
export async function query<T = any>(sqlQuery: string, params: any[] = []): Promise<T[]> {
  if (!mysqlPool) {
    throw new Error("Database not initialized")
  }
  const [rows] = await mysqlPool.execute(sqlQuery, params)
  return rows as T[]
}

// INSERT query sa vracanjem insertId
export async function insertQuery(sqlQuery: string, params: any[] = []): Promise<{ insertId: number }> {
  if (!mysqlPool) {
    throw new Error("Database not initialized")
  }
  const [result] = (await mysqlPool.execute(sqlQuery, params)) as any
  return { insertId: result. insertId }
}

// Zatvori connection pool
export async function closeDatabase(): Promise<void> {
  if (mysqlPool) {
    await mysqlPool.end()
    mysqlPool = null
    console.log("✓ MySQL connection pool closed")
  }
}