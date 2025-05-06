import { useState, useEffect, useCallback, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'

// Type-safe route definition
export const Route = createFileRoute('/')({
  component: HomePage,
})

// Task type definition
type Task = {
  id: string
  title: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  createdAt: Date
}

// Filter type
type FilterType = 'all' | 'active' | 'completed'

// Sort type
type SortType = 'createdAt' | 'priority' | 'title'

function HomePage() {
  // Task management state
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState<string>('')
  const [newTaskPriority, setNewTaskPriority] = useState<Task['priority']>('medium')
  const [filter, setFilter] = useState<FilterType>('all')
  const [sortBy, setSortBy] = useState<SortType>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks')
    if (savedTasks) {
      try {
        // Parse the JSON and convert string dates back to Date objects
        type StoredTask = Omit<Task, 'createdAt'> & { createdAt: string }
        const parsedTasks = JSON.parse(savedTasks).map((task: StoredTask) => ({
          ...task,
          createdAt: new Date(task.createdAt)
        }))
        setTasks(parsedTasks)
      } catch (error) {
        console.error('Error loading tasks from localStorage:', error)
      }
    }
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  // Task management functions
  const addTask = useCallback(() => {
    if (newTaskTitle.trim() === '') return

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: newTaskTitle.trim(),
      completed: false,
      priority: newTaskPriority,
      createdAt: new Date()
    }

    setTasks(prevTasks => [...prevTasks, newTask])
    setNewTaskTitle('')
    setNewTaskPriority('medium')
  }, [newTaskTitle, newTaskPriority])

  const toggleTaskCompletion = useCallback((id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }, [])

  const removeTask = useCallback((id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id))
  }, [])

  const updateTaskPriority = useCallback((id: string, priority: Task['priority']) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, priority } : task
      )
    )
  }, [])

  const toggleSortDirection = useCallback(() => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
  }, [])

  // Filtered and sorted tasks
  const filteredAndSortedTasks = useMemo(() => {
    // First filter the tasks
    const filtered = tasks.filter(task => {
      if (filter === 'all') return true
      if (filter === 'active') return !task.completed
      if (filter === 'completed') return task.completed
      return true
    })

    // Then sort them
    return [...filtered].sort((a, b) => {
      let comparison = 0

      if (sortBy === 'createdAt') {
        comparison = a.createdAt.getTime() - b.createdAt.getTime()
      } else if (sortBy === 'priority') {
        const priorityValues = { low: 0, medium: 1, high: 2 }
        comparison = priorityValues[a.priority] - priorityValues[b.priority]
      } else if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title)
      }

      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [tasks, filter, sortBy, sortDirection])

  // Task statistics
  const taskStats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter(task => task.completed).length
    const active = total - completed
    const highPriority = tasks.filter(task => task.priority === 'high').length

    return { total, completed, active, highPriority }
  }, [tasks])

  // Priority color mapping
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default: return ''
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">React Task Manager</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Task Stats Card */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden p-6">
          <h2 className="text-xl font-bold mb-4">Task Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold">{taskStats.total}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-700 dark:text-green-400">{taskStats.completed}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Completed</div>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{taskStats.active}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Active</div>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-700 dark:text-red-400">{taskStats.highPriority}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">High Priority</div>
            </div>
          </div>
        </div>

        {/* Add Task Card */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden p-6">
          <h2 className="text-xl font-bold mb-4">Add New Task</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Task title"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
            />
            <div className="flex space-x-2">
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as Task['priority'])}
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <button
                onClick={addTask}
                disabled={newTaskTitle.trim() === ''}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden p-6">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
          <h2 className="text-2xl font-bold">Tasks</h2>

          <div className="flex flex-wrap gap-2">
            {/* Filter buttons */}
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${filter === 'all' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 text-sm font-medium border-y border-r ${filter === 'active' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white'}`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${filter === 'completed' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white'}`}
              >
                Completed
              </button>
            </div>

            {/* Sort controls */}
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortType)}
                className="px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="createdAt">Sort by Date</option>
                <option value="priority">Sort by Priority</option>
                <option value="title">Sort by Title</option>
              </select>
              <button
                onClick={toggleSortDirection}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle sort direction"
              >
                {sortDirection === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>

        {filteredAndSortedTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No tasks found. Add some tasks to get started!
          </div>
        ) : (
          <ul className="space-y-2">
            {filteredAndSortedTasks.map(task => (
              <li key={task.id} className="border dark:border-gray-700 rounded-lg p-4 flex items-center justify-between gap-4 group hover:bg-blue-50/70 dark:hover:bg-blue-900/20 transition-colors">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task.id)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {task.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <select
                    value={task.priority}
                    onChange={(e) => updateTaskPriority(task.id, e.target.value as Task['priority'])}
                    className="text-xs border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <button
                    onClick={() => removeTask(task.id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    aria-label="Delete task"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
