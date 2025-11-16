import { Note } from '../entities/note.entity';

export interface INoteRepository {
  findAll(userId: number): Promise<Note[]>;
  findById(id: number, userId: number): Promise<Note | null>;
  findByCategory(userId: number, category: string): Promise<Note[]>;
  search(userId: number, query: string): Promise<Note[]>;
  create(note: Partial<Note>): Promise<Note>;
  update(id: number, userId: number, note: Partial<Note>): Promise<Note | null>;
  delete(id: number, userId: number): Promise<boolean>;
}
