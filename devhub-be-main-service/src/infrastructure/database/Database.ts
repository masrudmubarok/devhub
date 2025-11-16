import { Pool } from 'pg'

export class Database {
  private static instance: Pool

  static getInstance(): Pool {
    if (!Database.instance) {
      Database.instance = new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      })

      Database.instance.on('error', (err) => {
        console.error('Unexpected database error:', err)
      })

      console.log('✅ Database connection pool created')
    }

    return Database.instance
  }

  static async testConnection(): Promise<boolean> {
    try {
      const pool = Database.getInstance()
      await pool.query('SELECT NOW()')
      console.log('✅ Database connection successful')
      return true
    } catch (error) {
      console.error('❌ Database connection failed:', error)
      return false
    }
  }

  static async close(): Promise<void> {
    if (Database.instance) {
      await Database.instance.end()
      console.log('Database connection pool closed')
    }
  }
}
