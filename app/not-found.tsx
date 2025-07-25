export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4">404 - Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist.
        </p>
        <div className="space-x-4">
          <a 
            href="/dashboard"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded inline-block"
          >
            Go to Dashboard
          </a>
          <a 
            href="/"
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded inline-block"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  )
}