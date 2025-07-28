import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getDashboardData } from "@/lib/actions"
import { prisma } from "@/lib/prisma"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentTransactions } from "@/components/recent-transactions"
import { CategoryExpenses } from "@/components/category-expenses"
import { AddTransactionDialog } from "@/components/add-transaction-dialog"
import { ManageCategoriesDialog } from "@/components/manage-categories-dialog"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LayoutGrid, Receipt, PieChart } from "lucide-react"

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  const categories = await prisma.category.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
  })

  const data = await getDashboardData(user.id)

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <div className="grid grid-cols-3 gap-2 sm:flex sm:gap-4">
            <Link href="/dashboard">
              <Button variant="default" className="w-full gap-2 text-xs sm:text-sm py-2">
                <LayoutGrid size={14} />
                <span>Overview</span>
              </Button>
            </Link>
            <Link href="/dashboard/transactions">
              <Button variant="outline" className="w-full gap-2 text-xs sm:text-sm py-2 bg-transparent">
                <Receipt size={14} />
                <span>Transactions</span>
              </Button>
            </Link>
            <Link href="/dashboard/analysis">
              <Button variant="outline" className="w-full gap-2 text-xs sm:text-sm py-2 bg-transparent">
                <PieChart size={14} />
                <span>Analysis</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <AddTransactionDialog categories={categories} />
          <ManageCategoriesDialog categories={categories} />
        </div>
      </div>

      {/* Dashboard Stats */}
      <DashboardStats stats={data.stats} />

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RecentTransactions transactions={data.transactions} />
        <CategoryExpenses categoryExpenses={data.categoryExpenses} />
      </div>
    </div>
  )
}
