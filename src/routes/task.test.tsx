import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { RouterProvider, createRouter, createMemoryHistory } from '@tanstack/react-router'
import { routeTree } from '../routeTree.gen'

// LocalStorageのモック
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    clear: () => {
      store = {}
    },
    removeItem: (key: string) => {
      delete store[key]
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// crypto.randomUUIDのモック
Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: () => Math.random().toString(36).substring(7),
  },
})

// ルーターのセットアップヘルパー
const createTestRouter = (initialPath = '/task') => {
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

describe('TaskPage', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  describe('タスク追加機能', () => {
    it('新しいタスクを追加できる', async () => {
      const user = userEvent.setup()
      renderWithRouter()

      // ページが表示されるまで待つ
      const input = await screen.findByLabelText(/task title/i)
      const addButton = screen.getByRole('button', { name: /add task/i })

      await user.type(input, 'テストタスク')
      await user.click(addButton)

      await waitFor(() => {
        expect(screen.getByText('テストタスク')).toBeInTheDocument()
      })
    })

    it('空のタスクは追加できない', async () => {
      const user = userEvent.setup()
      renderWithRouter()

      const addButton = await screen.findByRole('button', { name: /add task/i })
      await user.click(addButton)

      // タスクリストに何も追加されていないことを確認
      const noTasksMessage = screen.getByText(/no tasks found/i)
      expect(noTasksMessage).toBeInTheDocument()
    })

    it('優先度を指定してタスクを追加できる', async () => {
      const user = userEvent.setup()
      renderWithRouter()

      const input = await screen.findByLabelText(/task title/i)
      const prioritySelect = screen.getByLabelText(/priority/i)
      const addButton = screen.getByRole('button', { name: /add task/i })

      await user.type(input, '重要なタスク')
      await user.selectOptions(prioritySelect, 'high')
      await user.click(addButton)

      await waitFor(() => {
        expect(screen.getByText('重要なタスク')).toBeInTheDocument()
        expect(screen.getByText('high')).toBeInTheDocument()
      })
    })

    it('Enterキーでタスクを追加できる', async () => {
      const user = userEvent.setup()
      renderWithRouter()

      const input = await screen.findByLabelText(/task title/i)
      await user.type(input, 'Enterで追加{Enter}')

      await waitFor(() => {
        expect(screen.getByText('Enterで追加')).toBeInTheDocument()
      })
    })
  })

  describe('タスク完了切り替え機能', () => {
    it('タスクを完了状態に切り替えられる', async () => {
      const user = userEvent.setup()
      renderWithRouter()

      // タスクを追加
      const input = await screen.findByLabelText(/task title/i)
      const addButton = screen.getByRole('button', { name: /add task/i })
      await user.type(input, '完了テスト')
      await user.click(addButton)

      // チェックボックスをクリック
      await waitFor(() => {
        const checkbox = screen.getByRole('checkbox')
        expect(checkbox).not.toBeChecked()
      })

      const checkbox = screen.getByRole('checkbox')
      await user.click(checkbox)

      await waitFor(() => {
        expect(checkbox).toBeChecked()
      })
    })
  })

  describe('タスク削除機能', () => {
    it('タスクを削除できる', async () => {
      const user = userEvent.setup()
      renderWithRouter()

      // タスクを追加
      const input = await screen.findByLabelText(/task title/i)
      const addButton = screen.getByRole('button', { name: /add task/i })
      await user.type(input, '削除テスト')
      await user.click(addButton)

      await waitFor(() => {
        expect(screen.getByText('削除テスト')).toBeInTheDocument()
      })

      // 削除ボタンをクリック（ホバーで表示されるのでDOM内には存在する）
      const deleteButton = screen.getByRole('button', { name: /delete task/i })
      await user.click(deleteButton)

      await waitFor(() => {
        expect(screen.queryByText('削除テスト')).not.toBeInTheDocument()
      })
    })
  })

  describe('フィルタリング機能', () => {
    it('Allフィルターですべてのタスクを表示', async () => {
      const user = userEvent.setup()
      renderWithRouter()

      // 複数のタスクを追加
      const input = await screen.findByLabelText(/task title/i)
      const addButton = screen.getByRole('button', { name: /add task/i })

      await user.type(input, 'タスク1')
      await user.click(addButton)
      await user.type(input, 'タスク2')
      await user.click(addButton)

      await waitFor(() => {
        expect(screen.getByText('タスク1')).toBeInTheDocument()
        expect(screen.getByText('タスク2')).toBeInTheDocument()
      })

      // Allフィルターがデフォルトで選択されている
      const allButton = screen.getByRole('button', { name: /^all$/i })
      expect(allButton).toHaveClass('bg-blue-600')
    })

    it('Activeフィルターで未完了タスクのみ表示', async () => {
      const user = userEvent.setup()
      renderWithRouter()

      // タスクを2つ追加
      const input = await screen.findByLabelText(/task title/i)
      const addButton = screen.getByRole('button', { name: /add task/i })

      await user.type(input, 'Task Active')
      await user.click(addButton)
      await user.type(input, 'Task Completed')
      await user.click(addButton)

      // タスクが両方表示されることを確認
      await waitFor(() => {
        expect(screen.getByText('Task Active')).toBeInTheDocument()
        expect(screen.getByText('Task Completed')).toBeInTheDocument()
      })

      // 2つ目のタスク（Task Completed）のチェックボックスを見つけてクリック
      const taskCompletedCheckbox = screen.getByText('Task Completed')
        .closest('li')
        ?.querySelector('input[type="checkbox"]') as HTMLInputElement

      await user.click(taskCompletedCheckbox)

      // チェックボックスが更新されるのを待つ
      await waitFor(() => {
        expect(taskCompletedCheckbox).toBeChecked()
      })

      // Activeフィルターをクリック
      const activeButton = screen.getByRole('button', { name: /^active$/i })
      await user.click(activeButton)

      // フィルタリングが適用されるのを待つ
      await waitFor(() => {
        expect(screen.getByText('Task Active')).toBeInTheDocument()
        expect(screen.queryByText('Task Completed')).not.toBeInTheDocument()
      })
    })

    it('Completedフィルターで完了タスクのみ表示', async () => {
      const user = userEvent.setup()
      renderWithRouter()

      // タスクを2つ追加
      const input = await screen.findByLabelText(/task title/i)
      const addButton = screen.getByRole('button', { name: /add task/i })

      await user.type(input, 'Task Todo')
      await user.click(addButton)
      await user.type(input, 'Task Done')
      await user.click(addButton)

      // タスクが両方表示されることを確認
      await waitFor(() => {
        expect(screen.getByText('Task Todo')).toBeInTheDocument()
        expect(screen.getByText('Task Done')).toBeInTheDocument()
      })

      // 2つ目のタスク（Task Done）のチェックボックスを見つけてクリック
      const taskDoneCheckbox = screen.getByText('Task Done')
        .closest('li')
        ?.querySelector('input[type="checkbox"]') as HTMLInputElement

      await user.click(taskDoneCheckbox)

      // チェックボックスが更新されるのを待つ
      await waitFor(() => {
        expect(taskDoneCheckbox).toBeChecked()
      })

      // Completedフィルターをクリック
      const completedButton = screen.getByRole('button', { name: /^completed$/i })
      await user.click(completedButton)

      // フィルタリングが適用されるのを待つ
      await waitFor(() => {
        expect(screen.queryByText('Task Todo')).not.toBeInTheDocument()
        expect(screen.getByText('Task Done')).toBeInTheDocument()
      })
    })
  })

  describe('ソート機能', () => {
    it('タイトルでソートできる', async () => {
      const user = userEvent.setup()
      renderWithRouter()

      // タスクを追加
      const input = await screen.findByLabelText(/task title/i)
      const addButton = screen.getByRole('button', { name: /add task/i })

      await user.type(input, 'Cタスク')
      await user.click(addButton)
      await user.type(input, 'Aタスク')
      await user.click(addButton)
      await user.type(input, 'Bタスク')
      await user.click(addButton)

      // タイトルでソート（Sort by Dateのオプションを含むselectを探す）
      const sortSelect = screen.getByRole('combobox', {
        name: (_content, element) => {
          return element?.querySelector('option[value="createdAt"]') !== null
        }
      })
      await user.selectOptions(sortSelect, 'title')

      // ソート方向を昇順に
      const sortDirectionButton = screen.getByRole('button', { name: /toggle sort direction/i })
      const currentDirection = sortDirectionButton.textContent
      if (currentDirection === '↓') {
        await user.click(sortDirectionButton)
      }

      // タスクが正しい順序で表示されることを確認
      await waitFor(() => {
        const tasks = screen.getAllByText(/タスク/)
        expect(tasks[0]).toHaveTextContent('Aタスク')
        expect(tasks[1]).toHaveTextContent('Bタスク')
        expect(tasks[2]).toHaveTextContent('Cタスク')
      })
    })
  })

  describe('統計情報', () => {
    it('タスク統計が正しく表示される', async () => {
      const user = userEvent.setup()
      renderWithRouter()

      // 初期状態 - ページが表示されるまで待つ
      await screen.findByText('Task Statistics')

      // タスクを追加
      const input = screen.getByLabelText(/task title/i)
      const addButton = screen.getByRole('button', { name: /add task/i })

      await user.type(input, 'タスク1')
      await user.click(addButton)

      await waitFor(() => {
        // Total が 1 になることを確認
        const totalStat = screen.getByText('Total').previousElementSibling
        expect(totalStat).toHaveTextContent('1')
      })
    })
  })

  describe('LocalStorage連携', () => {
    it('タスクがLocalStorageに保存される', async () => {
      const user = userEvent.setup()
      renderWithRouter()

      const input = await screen.findByLabelText(/task title/i)
      const addButton = screen.getByRole('button', { name: /add task/i })

      await user.type(input, '保存テスト')
      await user.click(addButton)

      await waitFor(() => {
        const saved = localStorageMock.getItem('tasks')
        expect(saved).toBeTruthy()
        const tasks = JSON.parse(saved!)
        expect(tasks).toHaveLength(1)
        expect(tasks[0].title).toBe('保存テスト')
      })
    })
  })
})
