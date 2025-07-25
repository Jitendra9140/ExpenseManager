'use client';
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getDashboardData } from "@/lib/actions"
import { prisma } from "@/lib/prisma"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentTransactions } from "@/components/recent-transactions"
import { CategoryExpenses } from "@/components/category-expenses"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AddTransactionDialog } from "@/components/add-transaction-dialog"
import { ManageCategoriesDialog } from "@/components/manage-categories-dialog"
import { LayoutGrid, Receipt, PieChart, Plus, Settings, Menu } from "lucide-react"

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  // Fetch categories in the server component (this is the correct place)
  const categories = await prisma.category.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
  })

  const data = await getDashboardData(user.id)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-4 lg:p-6 space-y-6">
        {/* Navigation Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Navigation Tabs */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            {/* Mobile: Show as dropdown-style buttons */}
            <div className="block sm:hidden">
              <div className="grid grid-cols-3 gap-2">
                <Link href="/dashboard" className="flex-1">
                  <Button variant="outline" className="w-full gap-2 text-xs py-2">
                    <LayoutGrid size={14} />
                    <span className="hidden xs:inline">Overview</span>
                  </Button>
                </Link>
                <Link href="/dashboard/transactions" className="flex-1">
                  <Button variant="outline" className="w-full gap-2 text-xs py-2">
                    <Receipt size={14} />
                    <span className="hidden xs:inline">Transactions</span>
                  </Button>
                </Link>
                <Link href="/dashboard/analysis" className="flex-1">
                  <Button variant="outline" className="w-full gap-2 text-xs py-2">
                    <PieChart size={14} />
                    <span className="hidden xs:inline">Analysis</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Desktop: Show as horizontal tabs */}
            <div className="hidden sm:flex gap-4">
              <Link href="/dashboard">
                <Button variant="outline" className="gap-2">
                  <LayoutGrid size={16} />
                  Overview
                </Button>
              </Link>
              <Link href="/dashboard/transactions">
                <Button variant="outline" className="gap-2">
                  <Receipt size={16} />
                  Transactions
                </Button>
              </Link>
              <Link href="/dashboard/analysis">
                <Button variant="outline" className="gap-2">
                  <PieChart size={16} />
                  Analysis
                </Button>
              </Link>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            {/* Mobile: Stack vertically */}
            <div className="block sm:hidden space-y-2">
              <AddTransactionDialog categories={categories} />
              <ManageCategoriesDialog categories={categories} />
            </div>

            {/* Desktop: Show horizontally */}
            <div className="hidden sm:flex gap-4">
              <AddTransactionDialog categories={categories} />
              <ManageCategoriesDialog categories={categories} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Dashboard Stats - Always full width */}
          <DashboardStats stats={data.stats} />

          {/* Content Grid - Responsive layout */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Recent Transactions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border">
              <div className="h-[400px] sm:h-[450px] lg:h-[360px]">
                <RecentTransactions transactions={data.transactions} />
              </div>
            </div>

            {/* Category Expenses */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border">
              <div className="h-[400px] sm:h-[450px] lg:h-[360px]">
                <CategoryExpenses categoryExpenses={data.categoryExpenses} />
              </div>
            </div>
          </div>

          {/* Mobile: Additional spacing at bottom for better scrolling */}
          <div className="h-4 sm:h-0"></div>
        </div>
      </div>
    </div>
  )
}