import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/users/')({
  component: UsersPage,
})

// サンプルユーザーデータ
const users = [
  { id: '1', name: 'ユーザー1', role: '開発者' },
  { id: '2', name: 'ユーザー2', role: 'デザイナー' },
  { id: '3', name: 'ユーザー3', role: 'マネージャー' },
]

function UsersPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Users</h1>
      <p className="mb-4">ユーザー一覧ページです。ユーザー名をクリックすると詳細が表示されます。</p>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">名前</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">役割</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    to="/users/$userId"
                    params={{ userId: user.id }}
                    className="text-blue-500 hover:text-blue-700 font-medium"
                  >
                    {user.name}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
