
"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center space-y-6 p-8 max-w-md">
        <div className="space-y-2">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Something went wrong!</h1>
          <p className="text-gray-600 dark:text-gray-400">An unexpected error occurred. Please try again.</p>
        </div>

        <Button onClick={reset} className="w-full">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    </div>
  )
}
