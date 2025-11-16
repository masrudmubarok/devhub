import { IUserRepository } from '../../domain/repositories/IUserRepository'
import { LoginUserDTO } from '../dto/LoginUserDTO'
import { TokenResponseDTO } from '../dto/TokenResponseDTO'

export class LoginUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: { compare: (plain: string, hashed: string) => Promise<boolean> },
    private jwtService: { generateTokens: (userId: number, email: string, role: string) => Promise<{ accessToken: string; refreshToken?: string; expiresIn: string }> }
  ) {}

  async execute(dto: LoginUserDTO): Promise<TokenResponseDTO> {
    // Find user by email
    const user = await this.userRepository.findByEmail(dto.email)
    if (!user) {
      throw new Error('Invalid credentials')
    }

    // Verify password
    const isPasswordValid = await this.passwordHasher.compare(dto.password, user.password)
    if (!isPasswordValid) {
      throw new Error('Invalid credentials')
    }

    // Generate JWT tokens
    const tokens = await this.jwtService.generateTokens(user.id, user.email, user.role)

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    }
  }
}
