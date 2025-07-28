import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
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

    // Fix: Ensure totalExpenses is always a number
    const totalExpenses = Number(expenses._sum.amount) || 0
    
    const formattedCategoryExpenses = categoryExpenses.map((ce) => {
      const category = categories.find((c) => c.id === ce.categoryId)
      const amount = Number(ce._sum.amount) || 0
      
      return {
        categoryId: ce.categoryId,
        categoryName: category?.name || "Unknown",
        amount,
        // Fix: Now totalExpenses is guaranteed to be a number
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      }
    })

    return NextResponse.json({
      stats: {
        balance: Number(income._sum.amount || 0) - Number(expenses._sum.amount || 0),
        totalIncome: Number(income._sum.amount) || 0,
        totalExpenses: Number(expenses._sum.amount) || 0,
      },
      categoryExpenses: formattedCategoryExpenses,
    })
  } catch (error) {
    console.error("Stats fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}