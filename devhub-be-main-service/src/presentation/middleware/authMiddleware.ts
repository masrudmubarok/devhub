import { Request, Response, NextFunction } from 'express'
import { JWTService } from '../../infrastructure/security/JWTService'

const jwtService = new JWTService()

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' })
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    const payload = await jwtService.verifyAccessToken(token)

    // Attach user info to request
    ;(req as any).user = {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    }

    next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user

  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' })
  }

  next()
}
