"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

type Transaction = {
  id: string
  type: "INCOME" | "EXPENSE"
  amount: number
  note?: string
  date: string
  category: {
    name: string
  }
}

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as "INCOME" | "EXPENSE"
      return (
        <Badge variant={type === "INCOME" ? "default" : "destructive"}>
          {type}
        </Badge>
      )
    },
  },
  {
    accessorKey: "category.name",
    header: "Category",
  },
  {
    accessorKey: "note",
    header: "Note",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount)

      return (
        <div
          className={`text-right font-medium ${
            row.getValue("type") === "INCOME" ? "text-green-600" : "text-red-600"
          }`}
        >
          {row.getValue("type") === "INCOME" ? "+" : "-"}{formatted}
        </div>
      )
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      return new Date(row.getValue("date")).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    },
  },
]