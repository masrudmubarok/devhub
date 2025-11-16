import { Injectable, Inject } from '@nestjs/common';
import { ITodoRepository } from '../../domain/repositories/todo.repository.interface';
import { TodoResponseDto } from '../dtos/todo.dto';

@Injectable()
export class GetTodosUseCase {
  constructor(
    @Inject('ITodoRepository')
    private readonly todoRepository: ITodoRepository,
  ) {}

  async execute(userId: number, status?: string, priority?: string): Promise<TodoResponseDto[]> {
    let todos;

    if (status) {
      todos = await this.todoRepository.findByStatus(userId, status);
    } else if (priority) {
      todos = await this.todoRepository.findByPriority(userId, priority);
    } else {
      todos = await this.todoRepository.findAll(userId);
    }

    return todos.map(todo => TodoResponseDto.fromEntity(todo));
  }
}
