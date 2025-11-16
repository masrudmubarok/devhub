import { IUserRepository } from '../../domain/repositories/IUserRepository'
import { RegisterUserDTO } from '../dto/RegisterUserDTO'
import { UserWithoutPassword } from '../../domain/entities/User'

export class RegisterUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: { hash: (password: string) => Promise<string> }
  ) {}

  async execute(dto: RegisterUserDTO): Promise<UserWithoutPassword> {
    // Validate email not exists
    const existingUser = await this.userRepository.findByEmail(dto.email)
    if (existingUser) {
      throw new Error('Email already registered')
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(dto.email)) {
      throw new Error('Invalid email format')
    }

    // Validate password strength
    if (dto.password.length < 8) {
      throw new Error('Password must be at least 8 characters')
    }

    // Hash password
    const hashedPassword = await this.passwordHasher.hash(dto.password)

    // Create user
    const user = await this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
      role: 'user', // default role
    })

    return user
  }
}
