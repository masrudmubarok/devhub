import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from '../../domain/entities/todo.entity';
import { ITodoRepository } from '../../domain/repositories/todo.repository.interface';

@Injectable()
export class TodoRepository implements ITodoRepository {
  constructor(
    @InjectRepository(Todo)
    private readonly repository: Repository<Todo>,
  ) {}

  async findAll(userId: number): Promise<Todo[]> {
    return await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: number, userId: number): Promise<Todo | null> {
    return await this.repository.findOne({
      where: { id, userId },
    });
  }

  async findByStatus(userId: number, status: string): Promise<Todo[]> {
    return await this.repository.find({
      where: { userId, status },
      order: { createdAt: 'DESC' },
    });
  }

  async findByPriority(userId: number, priority: string): Promise<Todo[]> {
    return await this.repository.find({
      where: { userId, priority },
      order: { createdAt: 'DESC' },
    });
  }

  async create(todo: Partial<Todo>): Promise<Todo> {
    const newTodo = this.repository.create(todo);
    return await this.repository.save(newTodo);
  }

  async update(id: number, userId: number, todo: Partial<Todo>): Promise<Todo | null> {
    await this.repository.update({ id, userId }, todo);
    return await this.findById(id, userId);
  }

  async delete(id: number, userId: number): Promise<boolean> {
    const result = await this.repository.delete({ id, userId });
    return result.affected > 0;
  }

  async getStats(userId: number): Promise<{
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
  }> {
    const todos = await this.findAll(userId);
    
    return {
      total: todos.length,
      pending: todos.filter(t => t.status === 'pending').length,
      in_progress: todos.filter(t => t.status === 'in_progress').length,
      completed: todos.filter(t => t.status === 'completed').length,
    };
  }
}
