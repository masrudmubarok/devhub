import jwt from 'jsonwebtoken'

export interface JWTPayload {
  sub: number // user id
  email: string
  role: string
}

export class JWTService {
  private readonly accessTokenSecret: string
  private readonly refreshTokenSecret: string
  private readonly accessTokenExpiry: string
  private readonly refreshTokenExpiry: string

  constructor() {
    this.accessTokenSecret = process.env.JWT_SECRET || 'default-secret-change-me'
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'refresh-secret-change-me'
    this.accessTokenExpiry = process.env.JWT_EXPIRES_IN || '7d'
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRES_IN || '30d'
  }

  async generateTokens(userId: number, email: string, role: string): Promise<{
    accessToken: string
    refreshToken: string
    expiresIn: string
  }> {
    const payload: JWTPayload = {
      sub: userId,
      email,
      role,
    }

    const accessToken = jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry,
    })

    const refreshToken = jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiry,
    })

    return {
      accessToken,
      refreshToken,
      expiresIn: this.accessTokenExpiry,
    }
  }

  async verifyAccessToken(token: string): Promise<JWTPayload> {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret) as JWTPayload
      return decoded
    } catch (error) {
      throw new Error('Invalid or expired access token')
    }
  }

  async verifyRefreshToken(token: string): Promise<{ userId: number; email: string; role: string }> {
    try {
      const decoded = jwt.verify(token, this.refreshTokenSecret) as JWTPayload
      return {
        userId: decoded.sub,
        email: decoded.email,
        role: decoded.role,
      }
    } catch (error) {
      throw new Error('Invalid or expired refresh token')
    }
  }
}
