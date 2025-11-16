import Link from 'next/link'
import { CheckCircle2, BookOpen, FileText, Code } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            DevHub
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            All-in-one Developer Productivity Platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Todo Card */}
          <Link href="/todos">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow cursor-pointer border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                <CheckCircle2 className="w-8 h-8 text-blue-600 dark:text-blue-300" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">
                To-Do Management
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Organize your daily tasks with priorities and due dates
              </p>
            </div>
          </Link>

          {/* Notes Card */}
          <Link href="/notes">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow cursor-pointer border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                <BookOpen className="w-8 h-8 text-green-600 dark:text-green-300" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">
                Notes & Knowledge Base
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                AI-powered notes, documentation, and code snippets
              </p>
            </div>
          </Link>

          {/* CV Builder Card */}
          <Link href="/cv">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow cursor-pointer border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full mb-4">
                <FileText className="w-8 h-8 text-purple-600 dark:text-purple-300" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">
                CV Builder
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Create professional resumes with AI assistance
              </p>
            </div>
          </Link>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-white dark:bg-slate-800 rounded-full px-6 py-3 shadow-md">
            <Code className="w-5 h-5 text-cyan-600" />
            <span className="text-slate-600 dark:text-slate-300">
              Built with Microservices Architecture
            </span>
          </div>
        </div>
      </div>
    </main>
  )
}
