import { Request, Response } from 'express'
import { Database } from '../../infrastructure/database/Database'
import { UserRepository } from '../../infrastructure/database/UserRepository'
import { PasswordHasher } from '../../infrastructure/security/PasswordHasher'
import { JWTService } from '../../infrastructure/security/JWTService'
import { RegisterUserUseCase } from '../../application/use-cases/RegisterUserUseCase'
import { LoginUserUseCase } from '../../application/use-cases/LoginUserUseCase'
import { RefreshTokenUseCase } from '../../application/use-cases/RefreshTokenUseCase'

const db = Database.getInstance()
const userRepository = new UserRepository(db)
const passwordHasher = new PasswordHasher()
const jwtService = new JWTService()

const registerUseCase = new RegisterUserUseCase(userRepository, passwordHasher)
const loginUseCase = new LoginUserUseCase(userRepository, passwordHasher, jwtService)
const refreshUseCase = new RefreshTokenUseCase(jwtService)

export class AuthController {
  // POST /auth/register
  async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body

      // Validation
      if (!email || !password || !name) {
        return res.status(400).json({ error: 'Email, password, and name are required' })
      }

      const user = await registerUseCase.execute({ email, password, name })

      res.status(201).json({
        message: 'User registered successfully',
        user,
      })
    } catch (error: any) {
      console.error('Register error:', error)
      res.status(400).json({ error: error.message || 'Registration failed' })
    }
  }

  // POST /auth/login
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body

      // Validation
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' })
      }

      const result = await loginUseCase.execute({ email, password })

      // Set httpOnly cookie for security (recommended for production)
      if (result.refreshToken) {
        res.cookie('refresh_token', result.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // HTTPS only in production
          sameSite: 'strict',
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        })
      }

      res.json({
        message: 'Login successful',
        accessToken: result.accessToken,
        expiresIn: result.expiresIn,
        user: result.user,
      })
    } catch (error: any) {
      console.error('Login error:', error)
      res.status(401).json({ error: error.message || 'Invalid credentials' })
    }
  }

  // POST /auth/refresh
  async refresh(req: Request, res: Response) {
    try {
      // Get refresh token from cookie or body
      const refreshToken = req.cookies?.refresh_token || req.body.refreshToken

      if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token required' })
      }

      const result = await refreshUseCase.execute(refreshToken)

      res.json({
        message: 'Token refreshed successfully',
        accessToken: result.accessToken,
        expiresIn: result.expiresIn,
      })
    } catch (error: any) {
      console.error('Refresh error:', error)
      res.status(401).json({ error: error.message || 'Token refresh failed' })
    }
  }

  // POST /auth/logout
  async logout(req: Request, res: Response) {
    try {
      // Clear refresh token cookie
      res.clearCookie('refresh_token')

      res.json({ message: 'Logout successful' })
    } catch (error: any) {
      console.error('Logout error:', error)
      res.status(500).json({ error: 'Logout failed' })
    }
  }

  // GET /auth/me - Get current user profile
  async me(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const user = await userRepository.findById(userId)

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      const { password, ...userWithoutPassword } = user

      res.json({ user: userWithoutPassword })
    } catch (error: any) {
      console.error('Get profile error:', error)
      res.status(500).json({ error: 'Failed to get profile' })
    }
  }
}
