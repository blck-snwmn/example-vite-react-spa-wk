import { createFileRoute, Link, useParams } from '@tanstack/react-router'

// 型安全なルート定義
export const Route = createFileRoute('/users/$userId')<{
  params: { userId: string }
}>({
  component: UserDetailPage,
})

// サンプルユーザーデータ
const users = [
  { id: '1', name: 'ユーザー1', role: '開発者', description: 'フロントエンド開発を担当。React、TypeScript、Tailwind CSSのスペシャリスト。' },
  { id: '2', name: 'ユーザー2', role: 'デザイナー', description: 'UIUXデザインを担当。使いやすく美しいインターフェースを設計する。' },
  { id: '3', name: 'ユーザー3', role: 'マネージャー', description: 'プロジェクト全体の管理を担当。チームのコーディネートとスケジュール管理を行う。' },
]

function UserDetailPage() {
  // 型安全なuseParamsの使用
  const { userId } = useParams({ from: '/users/$userId' })
  const user = users.find(u => u.id === userId)

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto text-center py-10">
        <h1 className="text-3xl font-bold mb-4">ユーザーが見つかりません</h1>
        <p className="mb-4">ID: {userId} のユーザーは存在しません。</p>
        <Link to="/users" className="text-blue-500 hover:text-blue-700 font-medium">
          ← ユーザー一覧に戻る
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4">
        <Link to="/users" className="text-blue-500 hover:text-blue-700 font-medium">
          ← ユーザー一覧に戻る
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden p-6">
        <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
        <div className="mb-4">
          <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
            {user.role}
          </span>
          <span className="text-gray-500 dark:text-gray-400">ID: {user.id}</span>
        </div>
        <p className="text-gray-700 dark:text-gray-300">{user.description}</p>
      </div>
    </div>
  )
}
