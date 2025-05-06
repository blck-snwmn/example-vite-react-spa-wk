// This is the root route file for the TanStack Router

import { createRootRoute, Outlet, Link } from '@tanstack/react-router'

// Create the root route
export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen p-10">
      <div className="flex gap-2 mb-4">
        <Link
          to="/"
          className="text-blue-500 hover:text-blue-700 font-medium"
          activeProps={{ className: 'font-bold text-blue-700' }}
        >
          Home
        </Link>
        <Link
          to="/task"
          className="text-blue-500 hover:text-blue-700 font-medium"
          activeProps={{ className: 'font-bold text-blue-700' }}
        >
          Tasks
        </Link>
        <Link
          to="/about"
          className="text-blue-500 hover:text-blue-700 font-medium"
          activeProps={{ className: 'font-bold text-blue-700' }}
        >
          About
        </Link>
        <Link
          to="/users"
          className="text-blue-500 hover:text-blue-700 font-medium"
          activeProps={{ className: 'font-bold text-blue-700' }}
        >
          Users
        </Link>
      </div>
      <hr className="mb-4" />
      <Outlet />
    </div>
  ),
})
