import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { TransactionFilters } from "@/components/transaction-filters"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Decimal } from "@prisma/client/runtime/library"

interface SearchParams {
  category?: string
  search?: string
}

interface Category {
  id: string
  name: string
  userId: string
}

interface Transaction {
  id: string
  type: "INCOME" | "EXPENSE"
  amount: Decimal
  note?: string | null
  date: Date
  category: {
    id: string
    name: string
  }
}

export default async function AnalysisPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  // Fetch categories
  const categories = await prisma.category.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
  })

  // Build where clause for transactions
  const where = {
    userId: user.id,
    ...(searchParams.category && { categoryId: searchParams.category }),
    ...(searchParams.search && {
      note: { contains: searchParams.search, mode: "insensitive" as const },
    }),
  }

  // Fetch filtered transactions
  const transactions = await prisma.transaction.findMany({
    where,
    include: {
      category: true,
    },
    orderBy: {
      date: "desc",
    },
  })

  const formatCurrency = (amount: number | string | Decimal) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Number(amount))
  }

  return (
    <div className="flex flex-col p h-screen max-h-screen overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-4 sm:p-6 border-b ">
        <h1 className="text-2xl sm:text-3xl font-bold">Analysis</h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="pt-3 sm:p-6 pb-8 ">
            <Card className="w-full mb-6">
              <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4">
                <CardTitle className="text-lg sm:text-xl">Transaction Analysis</CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="space-y-4 sm:space-y-6">
                  {/* Filters Section */}
                  <div className="w-full">
                    <TransactionFilters categories={categories} />
                  </div>

                  {/* Transactions List */}
                  <div className="space-y-3 sm:space-y-4">
                    {transactions.length === 0 ? (
                      <Card className="p-6 sm:p-8 text-center">
                        <p className="text-muted-foreground text-sm sm:text-base">No transactions found</p>
                      </Card>
                    ) : (
                      <>
                        {transactions.map((transaction) => (
                          <Card key={transaction.id} className="p-3 sm:p-4 hover:shadow-md transition-shadow">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                              {/* Left Section - Category and Note */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <Badge
                                    variant={transaction.type === "INCOME" ? "default" : "destructive"}
                                    className="text-xs"
                                  >
                                    {transaction.type}
                                  </Badge>
                                  <span className="font-medium text-sm sm:text-base truncate">
                                    {transaction.category.name}
                                  </span>
                                </div>
                                {transaction.note && (
                                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1">
                                    {transaction.note}
                                  </p>
                                )}
                              </div>

                              {/* Right Section - Amount and Date */}
                              <div className="flex-shrink-0 text-left sm:text-right">
                                <p
                                  className={`font-medium text-sm sm:text-base ${
                                    transaction.type === "INCOME" ? "text-green-600" : "text-red-600"
                                  }`}
                                >
                                  {transaction.type === "INCOME" ? "+" : "-"}
                                  {formatCurrency(transaction.amount)}
                                </p>
                                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                                  {new Date(transaction.date).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </p>
                              </div>
                            </div>
                          </Card>
                        ))}

                        {/* Bottom padding to ensure last item is visible */}
                        <div className="h-4"></div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
