import { type NextRequest, NextResponse } from "next/server"
import { categorySchema } from "@/lib/validations"
import { getCurrentUser } from "@/app/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name } = categorySchema.parse(body)

    // Check if category already exists for this user
    const existingCategory = await prisma.category.findFirst({
      where: {
        name,
        userId: user.id,
      },
    })

    if (existingCategory) {
      return NextResponse.json({ message: "Category already exists" }, { status: 400 })
    }

    const category = await prisma.category.create({
      data: {
        name,
        userId: user.id,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error("Category creation error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const categories = await prisma.category.findMany({
      where: { userId: user.id },
      orderBy: { name: "asc" },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Categories fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
