import { type NextRequest, NextResponse } from "next/server"
import { transactionSchema } from "@/lib/validations"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    
    try {
      const data = transactionSchema.parse(body)
      
      // Verify category belongs to user
      const category = await prisma.category.findFirst({
        where: {
          id: data.categoryId,
          userId: user.id,
        },
      })

      if (!category) {
        return NextResponse.json({ message: "Category not found" }, { status: 404 })
      }

      const transaction = await prisma.transaction.create({
        data: {
          ...data,
          userId: user.id,
        },
        include: {
          category: true,
        },
      })

      return NextResponse.json(transaction)
    } catch (validationError) {
      console.error("Validation error:", validationError)
      return NextResponse.json(
        { message: "Invalid data format", errors: validationError.errors },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("Transaction creation error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const type = searchParams.get("type")
    const categoryId = searchParams.get("categoryId")

    const where: any = { userId: user.id }
    if (type && (type === "INCOME" || type === "EXPENSE")) {
      where.type = type
    }
    if (categoryId) {
      where.categoryId = categoryId
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    })

    const total = await prisma.transaction.count({ where })

    return NextResponse.json({
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Transaction fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
