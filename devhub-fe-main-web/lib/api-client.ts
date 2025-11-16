import { getApiInstance } from '@/lib/api'

// Todo API - Direct access to Todo Service
export const todoApiClient = {
  getAll: (userId: number) => {
    const api = getApiInstance('todo')
    return api.get(`/todos?user_id=${userId}`)
  },
  getOne: (id: number, userId: number) => {
    const api = getApiInstance('todo')
    return api.get(`/todos/${id}?user_id=${userId}`)
  },
  create: (data: any) => {
    const api = getApiInstance('todo')
    return api.post('/todos', data)
  },
  update: (id: number, userId: number, data: any) => {
    const api = getApiInstance('todo')
    return api.put(`/todos/${id}?user_id=${userId}`, data)
  },
  delete: (id: number, userId: number) => {
    const api = getApiInstance('todo')
    return api.delete(`/todos/${id}?user_id=${userId}`)
  },
  getStats: (userId: number) => {
    const api = getApiInstance('todo')
    return api.get(`/todos/stats?user_id=${userId}`)
  },
}

// Notes API - Direct access to Notes Service
export const notesApiClient = {
  getAll: (userId: number) => {
    const api = getApiInstance('notes')
    return api.get(`/notes?user_id=${userId}`)
  },
  getOne: (id: number, userId: number) => {
    const api = getApiInstance('notes')
    return api.get(`/notes/${id}?user_id=${userId}`)
  },
  create: (data: any) => {
    const api = getApiInstance('notes')
    return api.post('/notes', data)
  },
  update: (id: number, userId: number, data: any) => {
    const api = getApiInstance('notes')
    return api.put(`/notes/${id}?user_id=${userId}`, data)
  },
  delete: (id: number, userId: number) => {
    const api = getApiInstance('notes')
    return api.delete(`/notes/${id}?user_id=${userId}`)
  },
  search: (userId: number, query: string) => {
    const api = getApiInstance('notes')
    return api.get(`/notes/search?user_id=${userId}&q=${query}`)
  },
  aiEnhance: (data: { action: string; content: string }) => {
    const api = getApiInstance('notes')
    return api.post('/notes/ai-enhance', data)
  },
}

// CV API - Direct access to CV Service
export const cvApiClient = {
  getAll: (userId: number) => {
    const api = getApiInstance('cv')
    return api.get(`/cv?user_id=${userId}`)
  },
  getOne: (id: number, userId: number) => {
    const api = getApiInstance('cv')
    return api.get(`/cv/${id}?user_id=${userId}`)
  },
  create: (data: any) => {
    const api = getApiInstance('cv')
    return api.post('/cv', data)
  },
  update: (id: number, userId: number, data: any) => {
    const api = getApiInstance('cv')
    return api.put(`/cv/${id}?user_id=${userId}`, data)
  },
  delete: (id: number, userId: number) => {
    const api = getApiInstance('cv')
    return api.delete(`/cv/${id}?user_id=${userId}`)
  },
  aiEnhance: (data: { action: string; content: string; cv_id: number }) => {
    const api = getApiInstance('cv')
    return api.post('/cv/ai-enhance', data)
  },
  addExperience: (cvId: number, data: any) => {
    const api = getApiInstance('cv')
    return api.post(`/cv/${cvId}/experiences`, data)
  },
  addEducation: (cvId: number, data: any) => {
    const api = getApiInstance('cv')
    return api.post(`/cv/${cvId}/education`, data)
  },
  addSkills: (cvId: number, data: any) => {
    const api = getApiInstance('cv')
    return api.post(`/cv/${cvId}/skills`, data)
  },
  addProject: (cvId: number, data: any) => {
    const api = getApiInstance('cv')
    return api.post(`/cv/${cvId}/projects`, data)
  },
}
