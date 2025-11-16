import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'

// Service URLs - Direct access to each microservice
const SERVICE_URLS = {
  todo: (process.env.NEXT_PUBLIC_TODO_SERVICE_URL as string) || 'http://localhost:3001',
  notes: (process.env.NEXT_PUBLIC_NOTES_SERVICE_URL as string) || 'http://localhost:3002',
  cv: (process.env.NEXT_PUBLIC_CV_SERVICE_URL as string) || 'http://localhost:3003',
  ai: (process.env.NEXT_PUBLIC_AI_SERVICE_URL as string) || 'http://localhost:8000',
}

// Create axios instances for each service
const createApiInstance = (baseURL: string) => {
  return axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

// Service-specific axios instances
export const todoApi = createApiInstance(SERVICE_URLS.todo)
export const notesApi = createApiInstance(SERVICE_URLS.notes)
export const cvApi = createApiInstance(SERVICE_URLS.cv)
export const aiApi = createApiInstance(SERVICE_URLS.ai)

// Helper to get API instance by service name
export const getApiInstance = (service: 'todo' | 'notes' | 'cv' | 'ai'): AxiosInstance => {
  switch (service) {
    case 'todo': return todoApi
    case 'notes': return notesApi
    case 'cv': return cvApi
    case 'ai': return aiApi
  }
}

// Apply interceptors to all instances
const setupInterceptors = (instance: AxiosInstance) => {
  // Request interceptor for adding JWT token
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('jwt_token') : null
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error: AxiosError) => {
      return Promise.reject(error)
    }
  )

  // Response interceptor for handling errors
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        // Unauthorized - clear token and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('jwt_token')
          window.location.href = '/login'
        }
      }
      return Promise.reject(error)
    }
  )
}

// Setup interceptors for all service instances
setupInterceptors(todoApi)
setupInterceptors(notesApi)
setupInterceptors(cvApi)
setupInterceptors(aiApi)

// Log service URLs in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🚀 DevHub - Direct Service Access Mode')
  console.log('📡 Service URLs:', SERVICE_URLS)
}
