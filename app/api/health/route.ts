import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { testConnection } from "@/lib/neon"

export async function GET() {
  try {
    // Test database connection
    const dbTest = await testConnection()

    // Test Prisma connection
    await prisma.$queryRaw`SELECT 1`

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: dbTest ? "connected" : "disconnected",
      prisma: "connected",
    })
  } catch (error) {
    console.error("Health check failed:", error)
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: "Database connection failed",
      },
      { status: 500 },
    )
  }
}
