export class RefreshTokenUseCase {
  constructor(
    private jwtService: {
      verifyRefreshToken: (token: string) => Promise<{ userId: number; email: string; role: string }>
      generateTokens: (userId: number, email: string, role: string) => Promise<{ accessToken: string; refreshToken?: string; expiresIn: string }>
    }
  ) {}

  async execute(refreshToken: string): Promise<{ accessToken: string; expiresIn: string }> {
    try {
      // Verify refresh token
      const payload = await this.jwtService.verifyRefreshToken(refreshToken)

      // Generate new access token
      const tokens = await this.jwtService.generateTokens(payload.userId, payload.email, payload.role)

      return {
        accessToken: tokens.accessToken,
        expiresIn: tokens.expiresIn,
      }
    } catch (error) {
      throw new Error('Invalid or expired refresh token')
    }
  }
}
