import { Pool } from 'pg'
import { IUserRepository } from '../../domain/repositories/IUserRepository'
import { User, UserWithoutPassword } from '../../domain/entities/User'

export class UserRepository implements IUserRepository {
  constructor(private db: Pool) {}

  async findById(id: number): Promise<User | null> {
    const result = await this.db.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    )
    return result.rows[0] || null
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )
    return result.rows[0] || null
  }

  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserWithoutPassword> {
    const result = await this.db.query(
      `INSERT INTO users (email, password, name, role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING id, email, name, role, created_at, updated_at`,
      [user.email, user.password, user.name, user.role]
    )
    return result.rows[0]
  }

  async update(id: number, data: Partial<User>): Promise<UserWithoutPassword | null> {
    const fields: string[] = []
    const values: any[] = []
    let paramCount = 1

    if (data.name !== undefined) {
      fields.push(`name = $${paramCount++}`)
      values.push(data.name)
    }
    if (data.email !== undefined) {
      fields.push(`email = $${paramCount++}`)
      values.push(data.email)
    }
    if (data.role !== undefined) {
      fields.push(`role = $${paramCount++}`)
      values.push(data.role)
    }

    if (fields.length === 0) return null

    fields.push(`updated_at = NOW()`)
    values.push(id)

    const result = await this.db.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount}
       RETURNING id, email, name, role, created_at, updated_at`,
      values
    )

    return result.rows[0] || null
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.query('DELETE FROM users WHERE id = $1', [id])
    return result.rowCount !== null && result.rowCount > 0
  }

  async findAll(limit: number = 50, offset: number = 0): Promise<UserWithoutPassword[]> {
    const result = await this.db.query(
      `SELECT id, email, name, role, created_at, updated_at
       FROM users
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    )
    return result.rows
  }

  async count(): Promise<number> {
    const result = await this.db.query('SELECT COUNT(*) as count FROM users')
    return parseInt(result.rows[0].count)
  }
}
