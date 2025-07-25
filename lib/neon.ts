import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

// Create a Neon SQL client
export const sql = neon(process.env.DATABASE_URL)

// Helper function to test database connection
export async function testConnection() {
  try {
    const result = await sql`SELECT NOW() as current_time`
    console.log("Database connected successfully:", result[0].current_time)
    return true
  } catch (error) {
    console.error("Database connection failed:", error)
    return false
  }
}

// Helper function for raw SQL queries if needed
export async function executeQuery(query: string, params: any[] = []) {
  try {
    return await sql(query, ...params)
  } catch (error) {
    console.error("Query execution failed:", error)
    throw error
  }
}
