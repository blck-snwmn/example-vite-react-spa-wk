import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { RouterProvider, createRouter, createMemoryHistory } from '@tanstack/react-router'
import { routeTree } from '../../routeTree.gen'

// ルーターのセットアップヘルパー
const createTestRouter = (initialPath = '/users/1') => {
  const history = createMemoryHistory({
    initialEntries: [initialPath],
  })

  return createRouter({
    routeTree,
    history,
  })
}

const renderWithRouter = (initialPath?: string) => {
  const router = createTestRouter(initialPath)
  return render(<RouterProvider router={router} />)
}

describe('UserDetailPage', () => {
  describe('正常なユーザー表示', () => {
    it('ユーザー1の情報を表示する', async () => {
      renderWithRouter('/users/1')

      expect(await screen.findByText('ユーザー1')).toBeInTheDocument()
      expect(screen.getByText('開発者')).toBeInTheDocument()
      expect(screen.getByText(/フロントエンド開発を担当/)).toBeInTheDocument()
      expect(screen.getByText('ID: 1')).toBeInTheDocument()
    })

    it('ユーザー2の情報を表示する', async () => {
      renderWithRouter('/users/2')

      expect(await screen.findByText('ユーザー2')).toBeInTheDocument()
      expect(screen.getByText('デザイナー')).toBeInTheDocument()
      expect(screen.getByText(/UIUXデザインを担当/)).toBeInTheDocument()
      expect(screen.getByText('ID: 2')).toBeInTheDocument()
    })

    it('ユーザー3の情報を表示する', async () => {
      renderWithRouter('/users/3')

      expect(await screen.findByText('ユーザー3')).toBeInTheDocument()
      expect(screen.getByText('マネージャー')).toBeInTheDocument()
      expect(screen.getByText(/プロジェクト全体の管理を担当/)).toBeInTheDocument()
      expect(screen.getByText('ID: 3')).toBeInTheDocument()
    })
  })

  describe('存在しないユーザー', () => {
    it('存在しないユーザーID（999）で404メッセージを表示する', async () => {
      renderWithRouter('/users/999')

      expect(await screen.findByText('ユーザーが見つかりません')).toBeInTheDocument()
      expect(screen.getByText('ID: 999 のユーザーは存在しません。')).toBeInTheDocument()
    })

    it('存在しないユーザーIDでユーザー一覧リンクを表示する', async () => {
      renderWithRouter('/users/invalid')

      expect(await screen.findByText('ユーザーが見つかりません')).toBeInTheDocument()

      const backLink = screen.getByText('← ユーザー一覧に戻る')
      expect(backLink).toBeInTheDocument()
      expect(backLink).toHaveAttribute('href', '/users')
    })
  })

  describe('ナビゲーション', () => {
    it('ユーザー一覧へ戻るリンクが表示される', async () => {
      renderWithRouter('/users/1')

      expect(await screen.findByText('ユーザー1')).toBeInTheDocument()

      const backLink = screen.getByText('← ユーザー一覧に戻る')
      expect(backLink).toBeInTheDocument()
      expect(backLink).toHaveAttribute('href', '/users')
    })
  })

  describe('ロールバッジ', () => {
    it('開発者ロールのバッジが表示される', async () => {
      renderWithRouter('/users/1')

      const roleBadge = await screen.findByText('開発者')
      expect(roleBadge).toBeInTheDocument()
      expect(roleBadge).toHaveClass('bg-blue-100')
    })

    it('デザイナーロールのバッジが表示される', async () => {
      renderWithRouter('/users/2')

      const roleBadge = await screen.findByText('デザイナー')
      expect(roleBadge).toBeInTheDocument()
      expect(roleBadge).toHaveClass('bg-blue-100')
    })

    it('マネージャーロールのバッジが表示される', async () => {
      renderWithRouter('/users/3')

      const roleBadge = await screen.findByText('マネージャー')
      expect(roleBadge).toBeInTheDocument()
      expect(roleBadge).toHaveClass('bg-blue-100')
    })
  })
})
