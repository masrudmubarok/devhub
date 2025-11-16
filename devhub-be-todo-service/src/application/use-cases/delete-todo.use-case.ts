import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ITodoRepository } from '../../domain/repositories/todo.repository.interface';

@Injectable()
export class DeleteTodoUseCase {
  constructor(
    @Inject('ITodoRepository')
    private readonly todoRepository: ITodoRepository,
  ) {}

  async execute(id: number, userId: number): Promise<void> {
    const result = await this.todoRepository.delete(id, userId);
    if (!result) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
  }
}
