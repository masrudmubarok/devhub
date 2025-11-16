// Domain Entity: User
export interface User {
  id: number
  email: string
  password: string // hashed
  name: string
  role: 'user' | 'admin'
  createdAt: Date
  updatedAt: Date
}

export interface UserWithoutPassword extends Omit<User, 'password'> {}
