'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notesApi } from '@/lib/api-client'
import { Plus, Search, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

export default function NotesPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [aiAction, setAiAction] = useState<string>('')
  const [selectedNote, setSelectedNote] = useState<any>(null)
  const userId = 1

  const { data: notes, isLoading } = useQuery({
    queryKey: ['notes', userId],
    queryFn: async () => {
      const res = await notesApi.getAll(userId)
      return res.data
    },
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => notesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      toast.success('Note created!')
      setShowForm(false)
    },
  })

  const aiEnhanceMutation = useMutation({
    mutationFn: (data: { action: string; content: string }) => notesApi.aiEnhance(data),
    onSuccess: (response) => {
      toast.success('AI enhancement completed!')
      console.log(response.data)
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    createMutation.mutate({
      user_id: userId,
      title: formData.get('title'),
      content: formData.get('content'),
      category: formData.get('category'),
      tags: [],
    })
  }

  const handleAiEnhance = (note: any, action: string) => {
    aiEnhanceMutation.mutate({
      action,
      content: note.content,
    })
  }

  if (isLoading) return <div className="p-8">Loading...</div>

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white">
            Notes & Knowledge Base
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <Plus className="w-5 h-5" />
            New Note
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg mb-8">
            <input
              name="title"
              placeholder="Note title"
              required
              className="w-full px-4 py-2 border rounded-lg mb-4 dark:bg-slate-700 dark:border-slate-600"
            />
            <textarea
              name="content"
              placeholder="Note content"
              required
              className="w-full px-4 py-2 border rounded-lg mb-4 dark:bg-slate-700 dark:border-slate-600"
              rows={6}
            />
            <select name="category" className="w-full px-4 py-2 border rounded-lg mb-4 dark:bg-slate-700">
              <option value="general">General</option>
              <option value="documentation">Documentation</option>
              <option value="snippet">Code Snippet</option>
            </select>
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
              Create Note
            </button>
          </form>
        )}

        {/* Notes Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {notes?.map((note: any) => (
            <div key={note.id} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-2">{note.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
                {note.content}
              </p>
              <div className="flex gap-2 mb-4">
                <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">
                  {note.category}
                </span>
              </div>
              
              {/* AI Enhancement Buttons */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => handleAiEnhance(note, 'summarize')}
                  className="flex items-center gap-1 text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                >
                  <Sparkles className="w-3 h-3" />
                  Summarize
                </button>
                <button
                  onClick={() => handleAiEnhance(note, 'improve')}
                  className="flex items-center gap-1 text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  <Sparkles className="w-3 h-3" />
                  Improve
                </button>
                <button
                  onClick={() => handleAiEnhance(note, 'generate_doc')}
                  className="flex items-center gap-1 text-xs px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  <Sparkles className="w-3 h-3" />
                  Generate Doc
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
