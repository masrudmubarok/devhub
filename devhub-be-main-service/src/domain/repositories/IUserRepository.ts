import { User, UserWithoutPassword } from '../entities/User'

export interface IUserRepository {
  findById(id: number): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserWithoutPassword>
  update(id: number, data: Partial<User>): Promise<UserWithoutPassword | null>
  delete(id: number): Promise<boolean>
  findAll(limit?: number, offset?: number): Promise<UserWithoutPassword[]>
  count(): Promise<number>
}
