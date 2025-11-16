import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Snippet } from '../../domain/entities/snippet.entity';
import { ISnippetRepository } from '../../domain/repositories/snippet.repository.interface';

@Injectable()
export class SnippetRepository implements ISnippetRepository {
  constructor(
    @InjectRepository(Snippet)
    private readonly repository: Repository<Snippet>,
  ) {}

  async findAll(userId: number): Promise<Snippet[]> {
    return await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: number, userId: number): Promise<Snippet | null> {
    return await this.repository.findOne({
      where: { id, userId },
    });
  }

  async findByLanguage(userId: number, language: string): Promise<Snippet[]> {
    return await this.repository.find({
      where: { userId, language },
      order: { createdAt: 'DESC' },
    });
  }

  async create(snippet: Partial<Snippet>): Promise<Snippet> {
    const newSnippet = this.repository.create(snippet);
    return await this.repository.save(newSnippet);
  }

  async update(id: number, userId: number, snippet: Partial<Snippet>): Promise<Snippet | null> {
    await this.repository.update({ id, userId }, snippet);
    return await this.findById(id, userId);
  }

  async delete(id: number, userId: number): Promise<boolean> {
    const result = await this.repository.delete({ id, userId });
    return result.affected > 0;
  }
}
