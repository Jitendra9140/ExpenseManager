import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
export default async function TransactionsPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }
  const transactions = await prisma.transaction.findMany({
    where: {
      userId: user.id,
    },
    include: {
      category: true,
    },
    orderBy: {
      date: "desc",
    },
  })
  // Transform the data for client-side rendering
  const formattedTransactions = transactions.map((transaction) => ({
    ...transaction,
    amount: Number(transaction.amount),
    date: transaction.date.toISOString(),
  }))
  return (
    <ScrollArea className="h-screen">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <Card className="px-4 pt-2">
          <CardHeader className="px-0 pt-0">
            <CardTitle>All Transactions</CardTitle>
          </CardHeader>
          <CardContent className="px-0 ">
            <DataTable columns={columns} data={formattedTransactions} />
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}