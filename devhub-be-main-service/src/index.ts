import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { Database } from './infrastructure/database/Database'
import authRoutes from './presentation/routes/auth.routes'
import adminRoutes from './presentation/routes/admin.routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true, // Allow cookies
  })
)
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Test database connection
Database.testConnection().catch((err) => {
  console.error('Failed to connect to database:', err)
  process.exit(1)
})

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Auth Service',
    timestamp: new Date().toISOString(),
  })
})

// API Routes
app.use('/auth', authRoutes)
app.use('/admin', adminRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`🔐 Auth Service (Authentication + Admin Dashboard) running on port ${PORT}`)
  console.log(`📍 Health: http://localhost:${PORT}/health`)
  console.log(`🔑 Auth: http://localhost:${PORT}/auth/*`)
  console.log(`⚙️  Admin: http://localhost:${PORT}/admin/*`)
})
