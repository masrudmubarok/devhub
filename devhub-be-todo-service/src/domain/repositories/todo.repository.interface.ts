import { Todo } from '../entities/todo.entity';

export interface ITodoRepository {
  findAll(userId: number): Promise<Todo[]>;
  findById(id: number, userId: number): Promise<Todo | null>;
  findByStatus(userId: number, status: string): Promise<Todo[]>;
  findByPriority(userId: number, priority: string): Promise<Todo[]>;
  create(todo: Partial<Todo>): Promise<Todo>;
  update(id: number, userId: number, todo: Partial<Todo>): Promise<Todo | null>;
  delete(id: number, userId: number): Promise<boolean>;
  getStats(userId: number): Promise<{
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
  }>;
}
