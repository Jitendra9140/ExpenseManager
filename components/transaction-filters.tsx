"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Category {
  id: string
  name: string
}

interface Props {
  categories: Category[]
}

export function TransactionFilters({ categories }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const selectedCategory = searchParams.get("category") ?? "all"
  const searchQuery = searchParams.get("search") ?? ""

  const onCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value !== "all") {
      params.set("category", value)
    } else {
      params.delete("category")
    }
    router.push(`/dashboard/analysis?${params.toString()}`)
  }

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams.toString())
    if (e.target.value) {
      params.set("search", e.target.value)
    } else {
      params.delete("search")
    }
    router.push(`/dashboard/analysis?${params.toString()}`)
  }

  return (
    <div className="flex gap-4 flex-wrap">
      <Input
        placeholder="Search notes..."
        className="max-w-sm"
        defaultValue={searchQuery}
        onChange={onSearchChange}
      />

      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="max-w-sm">
          <SelectValue placeholder="Filter by category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
