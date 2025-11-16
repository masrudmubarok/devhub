'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { todoApi } from '@/lib/api-client'
import { Plus, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function TodosPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const userId = 1 // Demo user

  const { data: todos, isLoading } = useQuery({
    queryKey: ['todos', userId],
    queryFn: async () => {
      const res = await todoApi.getAll(userId)
      return res.data
    },
  })

  const { data: stats } = useQuery({
    queryKey: ['todos-stats', userId],
    queryFn: async () => {
      const res = await todoApi.getStats(userId)
      return res.data
    },
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => todoApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      toast.success('Todo created!')
      setShowForm(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => todoApi.update(id, userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      toast.success('Todo updated!')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => todoApi.delete(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      toast.success('Todo deleted!')
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    createMutation.mutate({
      user_id: userId,
      title: formData.get('title'),
      description: formData.get('description'),
      priority: formData.get('priority'),
      status: 'pending',
    })
  }

  if (isLoading) return <div className="p-8">Loading...</div>

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white">
            To-Do Management
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            New Todo
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
              <div className="text-sm text-slate-600 dark:text-slate-400">Total</div>
              <div className="text-2xl font-bold">{stats.total}</div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg shadow">
              <div className="text-sm text-yellow-700 dark:text-yellow-400">Pending</div>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg shadow">
              <div className="text-sm text-blue-700 dark:text-blue-400">In Progress</div>
              <div className="text-2xl font-bold text-blue-600">{stats.in_progress}</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg shadow">
              <div className="text-sm text-green-700 dark:text-green-400">Completed</div>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            </div>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg mb-8">
            <input
              name="title"
              placeholder="Todo title"
              required
              className="w-full px-4 py-2 border rounded-lg mb-4 dark:bg-slate-700 dark:border-slate-600"
            />
            <textarea
              name="description"
              placeholder="Description"
              className="w-full px-4 py-2 border rounded-lg mb-4 dark:bg-slate-700 dark:border-slate-600"
              rows={3}
            />
            <select name="priority" className="w-full px-4 py-2 border rounded-lg mb-4 dark:bg-slate-700">
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Create Todo
            </button>
          </form>
        )}

        {/* Todo List */}
        <div className="space-y-4">
          {todos?.map((todo: any) => (
            <div key={todo.id} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{todo.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">{todo.description}</p>
                  <div className="flex gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      todo.priority === 'high' ? 'bg-red-100 text-red-700' :
                      todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {todo.priority}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      todo.status === 'completed' ? 'bg-green-100 text-green-700' :
                      todo.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {todo.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {todo.status !== 'completed' && (
                    <button
                      onClick={() => updateMutation.mutate({ id: todo.id, data: { status: 'completed' } })}
                      className="text-green-600 hover:text-green-700"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteMutation.mutate(todo.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
