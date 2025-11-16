import { Request, Response } from 'express'
import { Database } from '../../infrastructure/database/Database'
import { UserRepository } from '../../infrastructure/database/UserRepository'
import axios from 'axios'

const db = Database.getInstance()
const userRepository = new UserRepository(db)

const SERVICES = {
  todo: process.env.TODO_SERVICE_URL || 'http://localhost:3001',
  notes: process.env.NOTES_SERVICE_URL || 'http://localhost:3002',
  cv: process.env.CV_SERVICE_URL || 'http://localhost:3003',
  ai: process.env.AI_SERVICE_URL || 'http://localhost:8000',
}

export class AdminController {
  // GET /admin/health - Health check for all services
  async healthCheck(req: Request, res: Response) {
    try {
      const healthChecks = await Promise.allSettled([
        axios.get(`${SERVICES.todo}/health`, { timeout: 3000 }),
        axios.get(`${SERVICES.notes}/health`, { timeout: 3000 }),
        axios.get(`${SERVICES.cv}/health`, { timeout: 3000 }),
        axios.get(`${SERVICES.ai}/health`, { timeout: 3000 }),
        Database.testConnection(),
      ])

      const services = [
        {
          name: 'Todo Service',
          url: SERVICES.todo,
          status: healthChecks[0].status === 'fulfilled' ? 'healthy' : 'unhealthy',
          response: healthChecks[0].status === 'fulfilled' ? healthChecks[0].value.data : null,
        },
        {
          name: 'Notes Service',
          url: SERVICES.notes,
          status: healthChecks[1].status === 'fulfilled' ? 'healthy' : 'unhealthy',
          response: healthChecks[1].status === 'fulfilled' ? healthChecks[1].value.data : null,
        },
        {
          name: 'CV Service',
          url: SERVICES.cv,
          status: healthChecks[2].status === 'fulfilled' ? 'healthy' : 'unhealthy',
          response: healthChecks[2].status === 'fulfilled' ? healthChecks[2].value.data : null,
        },
        {
          name: 'AI Service',
          url: SERVICES.ai,
          status: healthChecks[3].status === 'fulfilled' ? 'healthy' : 'unhealthy',
          response: healthChecks[3].status === 'fulfilled' ? healthChecks[3].value.data : null,
        },
        {
          name: 'Database',
          status: healthChecks[4].status === 'fulfilled' && healthChecks[4].value ? 'healthy' : 'unhealthy',
        },
      ]

      const allHealthy = services.every((s) => s.status === 'healthy')

      res.json({
        status: allHealthy ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        services,
      })
    } catch (error: any) {
      console.error('Health check error:', error)
      res.status(500).json({ error: 'Health check failed' })
    }
  }

  // GET /admin/users - List all users (admin only)
  async listUsers(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 50
      const offset = parseInt(req.query.offset as string) || 0

      const users = await userRepository.findAll(limit, offset)
      const total = await userRepository.count()

      res.json({
        users,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      })
    } catch (error: any) {
      console.error('List users error:', error)
      res.status(500).json({ error: 'Failed to list users' })
    }
  }

  // GET /admin/stats - System statistics (admin only)
  async getStats(req: Request, res: Response) {
    try {
      const [usersCount, todosCount, notesCount, cvsCount] = await Promise.allSettled([
        userRepository.count(),
        db.query('SELECT COUNT(*) as count FROM todos'),
        db.query('SELECT COUNT(*) as count FROM notes'),
        db.query('SELECT COUNT(*) as count FROM cvs'),
      ])

      res.json({
        timestamp: new Date().toISOString(),
        stats: {
          users: usersCount.status === 'fulfilled' ? usersCount.value : 0,
          todos: todosCount.status === 'fulfilled' ? parseInt(todosCount.value.rows[0].count) : 0,
          notes: notesCount.status === 'fulfilled' ? parseInt(notesCount.value.rows[0].count) : 0,
          cvs: cvsCount.status === 'fulfilled' ? parseInt(cvsCount.value.rows[0].count) : 0,
        },
      })
    } catch (error: any) {
      console.error('Get stats error:', error)
      res.status(500).json({ error: 'Failed to get stats' })
    }
  }

  // PUT /admin/users/:id - Update user (admin only)
  async updateUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id)
      const { name, email, role } = req.body

      const user = await userRepository.update(userId, { name, email, role })

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      res.json({ message: 'User updated successfully', user })
    } catch (error: any) {
      console.error('Update user error:', error)
      res.status(500).json({ error: 'Failed to update user' })
    }
  }

  // DELETE /admin/users/:id - Delete user (admin only)
  async deleteUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id)

      const success = await userRepository.delete(userId)

      if (!success) {
        return res.status(404).json({ error: 'User not found' })
      }

      res.json({ message: 'User deleted successfully' })
    } catch (error: any) {
      console.error('Delete user error:', error)
      res.status(500).json({ error: 'Failed to delete user' })
    }
  }
}
