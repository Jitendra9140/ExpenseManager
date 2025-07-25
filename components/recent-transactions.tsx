import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

interface Transaction {
  id: string
  type: "INCOME" | "EXPENSE"
  amount: number | string
  note: string | null
  date: Date | string // Transaction date (user selected)
  createdAt?: Date | string // When it was actually created
  category: {
    name: string
  }
}

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  // Debug: Log transactions to see what we're getting
  // console.log("Recent Transactions received:", transactions)

  const formatCurrency = (amount: number | string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0)
  }

  // Ensure we have transactions and sort them by createdAt for recency
  const sortedTransactions = transactions && transactions.length > 0 
    ? [...transactions].sort((a, b) => {
        // Use createdAt for actual recency, fallback to date if createdAt not available
        const dateA = new Date(a.createdAt || a.date).getTime()
        const dateB = new Date(b.createdAt || b.date).getTime()
        return dateB - dateA // Most recent first
      })
    : []

  // console.log("Sorted transactions:", sortedTransactions)

  return (
    <Card className="h-full flex flex-col ">
      <CardHeader className="flex-shrink-0 pb-4">
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0 pb-6">
        {sortedTransactions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No transactions yet. Add your first transaction to get started!
          </p>
        ) : (
          <div className="flex-1 overflow-y-auto scrollbar-hide space-y-3 pr-2 -mr-2">
            {sortedTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={transaction.type === "INCOME" ? "default" : "destructive"} className="text-xs">
                      {transaction.type}
                    </Badge>
                    <span className="text-sm text-muted-foreground font-medium truncate">
                      {transaction.category.name}
                    </span>
                  </div>
                  {transaction.note && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 truncate">
                      {transaction.note}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(transaction.createdAt || transaction.date), { addSuffix: true })}
                  </p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className={`font-semibold text-sm ${transaction.type === "INCOME" ? "text-green-600" : "text-red-600"}`}>
                    {transaction.type === "INCOME" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(transaction.date).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}