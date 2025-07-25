import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface CategoryExpense {
  categoryId: string
  categoryName: string
  amount: number
  percentage: number
}

interface CategoryExpensesProps {
  categoryExpenses: CategoryExpense[]
}

export function CategoryExpenses({ categoryExpenses = [] }: CategoryExpensesProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount)
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Expense Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        {categoryExpenses.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No expenses recorded yet
          </p>
        ) : (
          <div className="space-y-4">
            {categoryExpenses.map((category) => (
              <div key={category.categoryId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">
                    {category.categoryName}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(category.amount)}
                    <span className="ml-1 text-xs">
                      ({category.percentage.toFixed(1)}%)
                    </span>
                  </span>
                </div>
                <Progress 
                  value={category.percentage} 
                  className="h-2" 
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}