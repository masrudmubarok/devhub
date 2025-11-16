import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Note } from '../../domain/entities/note.entity';
import { Snippet } from '../../domain/entities/snippet.entity';

export const getDatabaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'devhub',
  password: process.env.DB_PASSWORD || 'devhub123',
  database: process.env.DB_NAME || 'devhub',
  entities: [Note, Snippet],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});
