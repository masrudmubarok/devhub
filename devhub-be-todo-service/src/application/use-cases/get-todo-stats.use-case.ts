import { Injectable, Inject } from '@nestjs/common';
import { ITodoRepository } from '../../domain/repositories/todo.repository.interface';
import { TodoStatsDto } from '../dtos/todo.dto';

@Injectable()
export class GetTodoStatsUseCase {
  constructor(
    @Inject('ITodoRepository')
    private readonly todoRepository: ITodoRepository,
  ) {}

  async execute(userId: number): Promise<TodoStatsDto> {
    return await this.todoRepository.getStats(userId);
  }
}
