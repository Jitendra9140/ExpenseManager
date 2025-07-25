import { NextResponse } from "next/server"
import { getCurrentUser } from "@/app/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get total income and expenses
    const [income, expenses] = await Promise.all([
      prisma.transaction.aggregate({
        where: {
          userId: user.id,
          type: "INCOME",
        },
        _sum: {
          amount: true,
        },
      }),
      prisma.transaction.aggregate({
        where: {
          userId: user.id,
          type: "EXPENSE",
        },
        _sum: {
          amount: true,
        },
      }),
    ])

    // Get category-wise expenses
    const categoryExpenses = await prisma.transaction.groupBy({
      by: ["categoryId"],
      where: {
        userId: user.id,
        type: "EXPENSE",
      },
      _sum: {
        amount: true,
      },
    })

    // Get category details and calculate percentages
    const categories = await prisma.category.findMany({
      where: {
        id: {
          in: categoryExpenses.map((ce) => ce.categoryId),
        },
      },
    })

    const totalExpenses = expenses._sum.amount || 0
    const formattedCategoryExpenses = categoryExpenses.map((ce) => {
      const category = categories.find((c) => c.id === ce.categoryId)
      return {
        categoryId: ce.categoryId,
        categoryName: category?.name || "Unknown",
        amount: Number(ce._sum.amount) || 0,
        percentage: ((Number(ce._sum.amount) || 0) / totalExpenses) * 100,
      }
    })

    return NextResponse.json({
      stats: {
        balance: (income._sum.amount || 0) - (expenses._sum.amount || 0),
        totalIncome: income._sum.amount || 0,
        totalExpenses: expenses._sum.amount || 0,
      },
      categoryExpenses: formattedCategoryExpenses,
    })
  } catch (error) {
    console.error("Stats fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}