// import { prisma } from "@/lib/prisma"

// interface CategoryExpense {
//   categoryId: string
//   categoryName: string
//   amount: number
//   percentage: number
// }

// interface StatsResponse {
//   stats: {
//     balance: number
//     totalIncome: number
//     totalExpenses: number
//   }
//   categoryExpenses: CategoryExpense[]
// }

// export async function fetchStats(): Promise<StatsResponse> {
//   const response = await fetch("/api/stats")
//   if (!response.ok) {
//     throw new Error("Failed to fetch stats")
//   }
//   return response.json()
// }

// export async function getDashboardData(userId: string) {
//   // Get transactions for recent activity
//   const transactions = await prisma.transaction.findMany({
//     where: {
//       userId,
//     },
//     include: {
//       category: true,
//     },
//     orderBy: {
//       date: "desc",
//     },
//     take: 5,
//   })

//   // Calculate stats and category expenses
//   const [income, expenses, categoryExpenses] = await Promise.all([
//     prisma.transaction.aggregate({
//       where: {
//         userId,
//         type: "INCOME",
//       },
//       _sum: {
//         amount: true,
//       },
//     }),
//     prisma.transaction.aggregate({
//       where: {
//         userId,
//         type: "EXPENSE",
//       },
//       _sum: {
//         amount: true,
//       },
//     }),
//     prisma.transaction.groupBy({
//       by: ['categoryId'],
//       where: {
//         userId,
//         type: 'EXPENSE'
//       },
//       _sum: {
//         amount: true,
//       },
//     }),
//   ])

//   const totalExpenses = Number(expenses._sum.amount) || 0

//   // Get all categories that have expenses - this is the key fix
//   const categoryIds = categoryExpenses.map(ce => ce.categoryId).filter(Boolean)
  
//   const categories = await prisma.category.findMany({
//     where: {
//       id: {
//         in: categoryIds // Only get categories that actually have expenses
//       }
//     },
//   })

//   // Format category expenses with percentages and proper names
//   const formattedCategoryExpenses = categoryExpenses
//     .map(categoryExpense => {
//       const category = categories.find(cat => cat.id === categoryExpense.categoryId)
//       const amount = Number(categoryExpense._sum.amount) || 0
      
//       // Only include if we found the category and amount > 0
//       if (!category || amount <= 0) return null
      
//       return {
//         categoryId: category.id,
//         categoryName: category.name,
//         amount,
//         percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
//       }
//     })
//     .filter((ce): ce is CategoryExpense => ce !== null) // Remove null entries
//     .sort((a, b) => b.amount - a.amount) // Sort by amount in descending order

//   return {
//     transactions: transactions.map(transaction => ({
//       ...transaction,
//       amount: Number(transaction.amount),
//       date: transaction.date.toISOString(),
//     })),
//     stats: {
//       balance: Number(income._sum.amount || 0) - totalExpenses,
//       totalIncome: Number(income._sum.amount) || 0,
//       totalExpenses: totalExpenses,
//     },
//     categoryExpenses: formattedCategoryExpenses,
//   }
// }
// import { prisma } from "@/lib/prisma"

// interface CategoryExpense {
//   categoryId: string
//   categoryName: string
//   amount: number
//   percentage: number
// }

// interface StatsResponse {
//   stats: {
//     balance: number
//     totalIncome: number
//     totalExpenses: number
//   }
//   categoryExpenses: CategoryExpense[]
// }

// export async function fetchStats(): Promise<StatsResponse> {
//   const response = await fetch("/api/stats")
//   if (!response.ok) {
//     throw new Error("Failed to fetch stats")
//   }
//   return response.json()
// }

// export async function getDashboardData(userId: string) {
//   // Get transactions for recent activity
//   const transactions = await prisma.transaction.findMany({
//     where: {
//       userId,
//     },
//     include: {
//       category: true,
//     },
//     orderBy: {
//       date: "desc", // Most recent first
//     },
//     take: 10, // Get more transactions to show
//   })

//   // Calculate stats and category expenses
//   const [income, expenses, categoryExpenses] = await Promise.all([
//     prisma.transaction.aggregate({
//       where: {
//         userId,
//         type: "INCOME",
//       },
//       _sum: {
//         amount: true,
//       },
//     }),
//     prisma.transaction.aggregate({
//       where: {
//         userId,
//         type: "EXPENSE",
//       },
//       _sum: {
//         amount: true,
//       },
//     }),
//     prisma.transaction.groupBy({
//       by: ['categoryId'],
//       where: {
//         userId,
//         type: 'EXPENSE'
//       },
//       _sum: {
//         amount: true,
//       },
//     }),
//   ])

//   const totalExpenses = Number(expenses._sum.amount) || 0

//   // Get all categories that have expenses - this is the key fix
//   const categoryIds = categoryExpenses.map(ce => ce.categoryId).filter(Boolean)
  
//   const categories = await prisma.category.findMany({
//     where: {
//       id: {
//         in: categoryIds // Only get categories that actually have expenses
//       }
//     },
//   })

//   // Format category expenses with percentages and proper names
//   const formattedCategoryExpenses = categoryExpenses
//     .map(categoryExpense => {
//       const category = categories.find(cat => cat.id === categoryExpense.categoryId)
//       const amount = Number(categoryExpense._sum.amount) || 0
      
//       // Only include if we found the category and amount > 0
//       if (!category || amount <= 0) return null
      
//       return {
//         categoryId: category.id,
//         categoryName: category.name,
//         amount,
//         percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
//       }
//     })
//     .filter((ce): ce is CategoryExpense => ce !== null) // Remove null entries
//     .sort((a, b) => b.amount - a.amount) // Sort by amount in descending order

//   return {
//     transactions: transactions.map(transaction => ({
//       ...transaction,
//       amount: Number(transaction.amount),
//       date: transaction.date.toISOString(),
//     })),
//     stats: {
//       balance: Number(income._sum.amount || 0) - totalExpenses,
//       totalIncome: Number(income._sum.amount) || 0,
//       totalExpenses: totalExpenses,
//     },
//     categoryExpenses: formattedCategoryExpenses,
//   }
// }
import { prisma } from "@/lib/prisma"

interface CategoryExpense {
  categoryId: string
  categoryName: string
  amount: number
  percentage: number
}

interface StatsResponse {
  stats: {
    balance: number
    totalIncome: number
    totalExpenses: number
  }
  categoryExpenses: CategoryExpense[]
}

export async function fetchStats(): Promise<StatsResponse> {
  const response = await fetch("/api/stats")
  if (!response.ok) {
    throw new Error("Failed to fetch stats")
  }
  return response.json()
}

export async function getDashboardData(userId: string) {
  // Get transactions for recent activity
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc", // Use createdAt instead of date for recent activity
    },
    take: 10, // Get more transactions to show
  })

  // Calculate stats and category expenses
  const [income, expenses, categoryExpenses] = await Promise.all([
    prisma.transaction.aggregate({
      where: {
        userId,
        type: "INCOME",
      },
      _sum: {
        amount: true,
      },
    }),
    prisma.transaction.aggregate({
      where: {
        userId,
        type: "EXPENSE",
      },
      _sum: {
        amount: true,
      },
    }),
    prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        type: 'EXPENSE'
      },
      _sum: {
        amount: true,
      },
    }),
  ])

  const totalExpenses = Number(expenses._sum.amount) || 0

  // Get all categories that have expenses - this is the key fix
  const categoryIds = categoryExpenses.map(ce => ce.categoryId).filter(Boolean)
  
  const categories = await prisma.category.findMany({
    where: {
      id: {
        in: categoryIds // Only get categories that actually have expenses
      }
    },
  })

  // Format category expenses with percentages and proper names
  const formattedCategoryExpenses = categoryExpenses
    .map(categoryExpense => {
      const category = categories.find(cat => cat.id === categoryExpense.categoryId)
      const amount = Number(categoryExpense._sum.amount) || 0
      
      // Only include if we found the category and amount > 0
      if (!category || amount <= 0) return null
      
      return {
        categoryId: category.id,
        categoryName: category.name,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
      }
    })
    .filter((ce): ce is CategoryExpense => ce !== null) // Remove null entries
    .sort((a, b) => b.amount - a.amount) // Sort by amount in descending order

  return {
    transactions: transactions.map(transaction => ({
      ...transaction,
      amount: Number(transaction.amount),
      date: transaction.date.toISOString(),
    })),
    stats: {
      balance: Number(income._sum.amount || 0) - totalExpenses,
      totalIncome: Number(income._sum.amount) || 0,
      totalExpenses: totalExpenses,
    },
    categoryExpenses: formattedCategoryExpenses,
  }
}