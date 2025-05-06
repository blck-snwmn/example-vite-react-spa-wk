import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">About</h1>
      <p className="mb-4">
        このプロジェクトはVite + React + Cloudflare Workersを使用したSPAアプリケーションです。
        TanStack Routerを使ってファイルベースルーティングを実装しています。
      </p>
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">技術スタック</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Vite - 高速な開発環境</li>
          <li>React - UIライブラリ</li>
          <li>TypeScript - 型安全なJavaScript</li>
          <li>TanStack Router - ファイルベースルーティング</li>
          <li>Tailwind CSS - ユーティリティファーストのCSSフレームワーク</li>
          <li>Cloudflare Workers - エッジでの実行環境</li>
        </ul>
      </div>
    </div>
  )
}
