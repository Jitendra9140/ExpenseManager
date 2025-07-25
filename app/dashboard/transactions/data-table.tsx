"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "lucide-react"
import { useState } from "react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  return (
    <div className="space-y-4 ">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Filter transactions..."
            value={(table.getColumn("note")?.getFilterValue() as string) ?? ""}
            onChange={(e) =>
              table.getColumn("note")?.setFilterValue(e.target.value)
            }
            className="pl-10"
          />
        </div>
        <div className="hidden sm:block text-sm text-gray-500 dark:text-gray-400">
          {table.getFilteredRowModel().rows.length} of {data.length} transaction(s)
        </div>
      </div>

      {/* Table Container */}
      <div className="border rounded-lg overflow-hidden ">
        {/* Mobile View */}
        <div className="block lg:hidden">
          <div className="max-h-[390px] overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700 scrollbar-hide overflow-auto ">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <div key={row.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <div className="space-y-2">
                    {row.getVisibleCells().map((cell) => {
                      const header = cell.column.columnDef.header
                      const label = typeof header === "string" ? header : "Field"
                      return (
                        <div key={cell.id} className="flex justify-between items-start">
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {label}
                          </span>
                          <span className="text-sm text-gray-900 dark:text-gray-100 text-right">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <Search className="h-6 w-6 mb-2 text-gray-300 mx-auto" />
                <p>No transactions found</p>
                <p className="text-xs">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <div className="max-h-[350px] overflow-auto scrollbar-hide">
            <Table className="">
              <TableHeader className="sticky top-0 bg-white dark:bg-gray-800 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="whitespace-nowrap">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="whitespace-nowrap">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-32 text-center">
                      <div className="text-gray-500 dark:text-gray-400">
                        <Search className="h-6 w-6 mb-2 text-gray-300 mx-auto" />
                        <p>No transactions found</p>
                        <p className="text-xs">Try adjusting your search criteria</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-500 dark:text-gray-400 order-2 sm:order-1">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2 order-1 sm:order-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="hidden sm:inline-flex"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
          <div className="hidden md:flex items-center space-x-1">
            {Array.from({ length: Math.min(5, table.getPageCount()) }).map((_, i) => {
              const current = table.getState().pagination.pageIndex
              const pageCount = table.getPageCount()
              let pageNumber
              if (pageCount <= 5) {
                pageNumber = i
              } else if (current < 3) {
                pageNumber = i
              } else if (current > pageCount - 3) {
                pageNumber = pageCount - 5 + i
              } else {
                pageNumber = current - 2 + i
              }

              return (
                <Button
                  key={pageNumber}
                  variant={current === pageNumber ? "default" : "outline"}
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => table.setPageIndex(pageNumber)}
                >
                  {pageNumber + 1}
                </Button>
              )
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4 sm:ml-1" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="hidden sm:inline-flex"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
