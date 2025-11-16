'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cvApi } from '@/lib/api-client'
import { Plus, FileText, Sparkles, Download } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CVPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const userId = 1

  const { data: cvs, isLoading } = useQuery({
    queryKey: ['cvs', userId],
    queryFn: async () => {
      const res = await cvApi.getAll(userId)
      return res.data
    },
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => cvApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cvs'] })
      toast.success('CV created!')
      setShowForm(false)
    },
  })

  const aiEnhanceMutation = useMutation({
    mutationFn: (data: any) => cvApi.aiEnhance(data),
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
      full_name: formData.get('full_name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      location: formData.get('location'),
      professional_summary: formData.get('professional_summary'),
      template: formData.get('template'),
    })
  }

  const handleAiEnhance = (cv: any, action: string) => {
    aiEnhanceMutation.mutate({
      action,
      content: cv.professional_summary,
      cv_id: cv.id,
    })
  }

  if (isLoading) return <div className="p-8">Loading...</div>

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white">
            CV Builder
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            <Plus className="w-5 h-5" />
            New CV
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg mb-8">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input
                name="full_name"
                placeholder="Full Name"
                required
                className="px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                required
                className="px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
              />
              <input
                name="phone"
                placeholder="Phone"
                className="px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
              />
              <input
                name="location"
                placeholder="Location"
                className="px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
              />
            </div>
            <textarea
              name="professional_summary"
              placeholder="Professional Summary"
              className="w-full px-4 py-2 border rounded-lg mb-4 dark:bg-slate-700 dark:border-slate-600"
              rows={4}
            />
            <select name="template" className="w-full px-4 py-2 border rounded-lg mb-4 dark:bg-slate-700">
              <option value="modern">Modern Template</option>
              <option value="classic">Classic Template</option>
              <option value="minimal">Minimal Template</option>
            </select>
            <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
              Create CV
            </button>
          </form>
        )}

        {/* CV List */}
        <div className="space-y-6">
          {cvs?.map((cv: any) => (
            <div key={cv.id} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-1">{cv.full_name}</h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    {cv.email} • {cv.phone} • {cv.location}
                  </p>
                </div>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm">
                  {cv.template}
                </span>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Professional Summary</h3>
                <p className="text-slate-600 dark:text-slate-400">{cv.professional_summary}</p>
              </div>

              {/* AI Enhancement Buttons */}
              <div className="flex gap-2 flex-wrap mb-4">
                <button
                  onClick={() => handleAiEnhance(cv, 'rewrite_summary')}
                  className="flex items-center gap-1 text-sm px-3 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                >
                  <Sparkles className="w-4 h-4" />
                  Rewrite Summary
                </button>
                <button
                  onClick={() => handleAiEnhance(cv, 'improve_experience')}
                  className="flex items-center gap-1 text-sm px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  <Sparkles className="w-4 h-4" />
                  Improve Experience
                </button>
                <button
                  onClick={() => handleAiEnhance(cv, 'generate_skills')}
                  className="flex items-center gap-1 text-sm px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate Skills
                </button>
                <button
                  onClick={() => handleAiEnhance(cv, 'translate')}
                  className="flex items-center gap-1 text-sm px-3 py-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                >
                  <Sparkles className="w-4 h-4" />
                  Translate
                </button>
              </div>

              <button className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 px-4 py-2 rounded hover:bg-slate-200">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
