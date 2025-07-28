import type React from "react"
import { getCurrentUser } from "@/lib/auth"
import { Header } from "@/components/header"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header user={user} />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
