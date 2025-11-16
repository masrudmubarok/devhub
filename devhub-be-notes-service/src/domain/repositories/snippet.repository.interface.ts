import { Snippet } from '../entities/snippet.entity';

export interface ISnippetRepository {
  findAll(userId: number): Promise<Snippet[]>;
  findById(id: number, userId: number): Promise<Snippet | null>;
  findByLanguage(userId: number, language: string): Promise<Snippet[]>;
  create(snippet: Partial<Snippet>): Promise<Snippet>;
  update(id: number, userId: number, snippet: Partial<Snippet>): Promise<Snippet | null>;
  delete(id: number, userId: number): Promise<boolean>;
}
