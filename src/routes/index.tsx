import { Link } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'

// Type-safe route definition
export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">React SPA Example</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Welcome to our React SPA</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          This is a sample Single Page Application built with React, Vite, and TanStack Router.
          It demonstrates various features and pages that you can explore.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Task Manager Card */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden p-6">
          <h2 className="text-xl font-bold mb-2">Task Manager</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            A full-featured task management application with filtering, sorting, and local storage persistence.
          </p>
          <Link
            to="/task"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Go to Task Manager
          </Link>
        </div>

        {/* About Page Card */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden p-6">
          <h2 className="text-xl font-bold mb-2">About Page</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Learn more about this application, its features, and the technologies used to build it.
          </p>
          <Link
            to="/about"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Go to About Page
          </Link>
        </div>

        {/* Users Page Card */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden p-6">
          <h2 className="text-xl font-bold mb-2">Users Page</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            View a list of users and their profiles in this demo page.
          </p>
          <Link
            to="/users"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Go to Users Page
          </Link>
        </div>

        {/* Features Card */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden p-6">
          <h2 className="text-xl font-bold mb-2">Features</h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4">
            <li>Type-safe routing with TanStack Router</li>
            <li>Fast development with Vite</li>
            <li>Modern React with hooks and functional components</li>
            <li>Responsive design with Tailwind CSS</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
