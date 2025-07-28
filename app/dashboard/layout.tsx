import type React from "react"
import { getCurrentUser } from "@/lib/auth"
import { Header } from "@/components/header"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header user={user} />
      <div className="h-[calc(100vh-4rem)] overflow-hidden p-2">
        <div className="mx-auto max-w-7xl">{children}</div>
      </div>
    </div>
  )
}
