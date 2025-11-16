import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Note } from '../../domain/entities/note.entity';
import { INoteRepository } from '../../domain/repositories/note.repository.interface';

@Injectable()
export class NoteRepository implements INoteRepository {
  constructor(
    @InjectRepository(Note)
    private readonly repository: Repository<Note>,
  ) {}

  async findAll(userId: number): Promise<Note[]> {
    return await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: number, userId: number): Promise<Note | null> {
    return await this.repository.findOne({
      where: { id, userId },
    });
  }

  async findByCategory(userId: number, category: string): Promise<Note[]> {
    return await this.repository.find({
      where: { userId, category },
      order: { createdAt: 'DESC' },
    });
  }

  async search(userId: number, query: string): Promise<Note[]> {
    return await this.repository.find({
      where: [
        { userId, title: ILike(`%${query}%`) },
        { userId, content: ILike(`%${query}%`) },
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async create(note: Partial<Note>): Promise<Note> {
    const newNote = this.repository.create(note);
    return await this.repository.save(newNote);
  }

  async update(id: number, userId: number, note: Partial<Note>): Promise<Note | null> {
    await this.repository.update({ id, userId }, note);
    return await this.findById(id, userId);
  }

  async delete(id: number, userId: number): Promise<boolean> {
    const result = await this.repository.delete({ id, userId });
    return result.affected > 0;
  }
}
