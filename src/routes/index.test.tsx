import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { RouterProvider, createRouter, createMemoryHistory } from '@tanstack/react-router'
import { routeTree } from '../routeTree.gen'

// ルーターのセットアップヘルパー
const createTestRouter = () => {
  const history = createMemoryHistory({
    initialEntries: ['/'],
  })

  return createRouter({
    routeTree,
    history,
  })
}

const renderWithRouter = () => {
  const router = createTestRouter()
  return render(<RouterProvider router={router} />)
}

describe('HomePage', () => {
  describe('基本表示', () => {
    it('ページタイトルが表示される', async () => {
      renderWithRouter()

      expect(await screen.findByText('React SPA Example')).toBeInTheDocument()
    })

    it('ウェルカムメッセージが表示される', async () => {
      renderWithRouter()

      expect(await screen.findByText('Welcome to our React SPA')).toBeInTheDocument()
      expect(
        screen.getByText(/This is a sample Single Page Application/)
      ).toBeInTheDocument()
    })
  })

  describe('カードセクション', () => {
    it('Task Managerカードが表示される', async () => {
      renderWithRouter()

      expect(await screen.findByText('Task Manager')).toBeInTheDocument()
      expect(
        screen.getByText(/A full-featured task management application/)
      ).toBeInTheDocument()

      const taskLink = screen.getByText('Go to Task Manager')
      expect(taskLink).toBeInTheDocument()
      expect(taskLink).toHaveAttribute('href', '/task')
    })

    it('About Pageカードが表示される', async () => {
      renderWithRouter()

      expect(await screen.findByText('About Page')).toBeInTheDocument()
      expect(
        screen.getByText(/Learn more about this application/)
      ).toBeInTheDocument()

      const aboutLink = screen.getByText('Go to About Page')
      expect(aboutLink).toBeInTheDocument()
      expect(aboutLink).toHaveAttribute('href', '/about')
    })

    it('Users Pageカードが表示される', async () => {
      renderWithRouter()

      expect(await screen.findByText('Users Page')).toBeInTheDocument()
      expect(
        screen.getByText(/View a list of users and their profiles/)
      ).toBeInTheDocument()

      const usersLink = screen.getByText('Go to Users Page')
      expect(usersLink).toBeInTheDocument()
      expect(usersLink).toHaveAttribute('href', '/users')
    })

    it('Featuresカードが表示される', async () => {
      renderWithRouter()

      expect(await screen.findByText('Features')).toBeInTheDocument()
      expect(screen.getByText(/Type-safe routing with TanStack Router/)).toBeInTheDocument()
      expect(screen.getByText(/Fast development with Vite/)).toBeInTheDocument()
      expect(screen.getByText(/Modern React with hooks and functional components/)).toBeInTheDocument()
      expect(screen.getByText(/Responsive design with Tailwind CSS/)).toBeInTheDocument()
    })
  })

  describe('ナビゲーションリンク', () => {
    it('すべてのナビゲーションリンクが正しいhrefを持つ', async () => {
      renderWithRouter()

      await screen.findByText('React SPA Example')

      const taskLink = screen.getByText('Go to Task Manager')
      expect(taskLink.getAttribute('href')).toBe('/task')

      const aboutLink = screen.getByText('Go to About Page')
      expect(aboutLink.getAttribute('href')).toBe('/about')

      const usersLink = screen.getByText('Go to Users Page')
      expect(usersLink.getAttribute('href')).toBe('/users')
    })

    it('リンクが正しいスタイルクラスを持つ', async () => {
      renderWithRouter()

      await screen.findByText('React SPA Example')

      const links = [
        screen.getByText('Go to Task Manager'),
        screen.getByText('Go to About Page'),
        screen.getByText('Go to Users Page'),
      ]

      links.forEach((link) => {
        expect(link).toHaveClass('bg-blue-600')
        expect(link).toHaveClass('hover:bg-blue-700')
        expect(link).toHaveClass('text-white')
      })
    })
  })

  describe('レスポンシブデザイン', () => {
    it('グリッドレイアウトクラスが適用されている', async () => {
      renderWithRouter()

      await screen.findByText('React SPA Example')

      // カードコンテナがグリッドレイアウトを持つことを確認
      const container = screen.getByText('Task Manager').closest('.grid')
      expect(container).toHaveClass('grid')
      expect(container).toHaveClass('grid-cols-1')
      expect(container).toHaveClass('md:grid-cols-2')
    })
  })
})
