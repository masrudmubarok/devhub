import { Injectable, Inject } from '@nestjs/common';
import { ITodoRepository } from '../../domain/repositories/todo.repository.interface';
import { CreateTodoDto, TodoResponseDto } from '../dtos/todo.dto';

@Injectable()
export class CreateTodoUseCase {
  constructor(
    @Inject('ITodoRepository')
    private readonly todoRepository: ITodoRepository,
  ) {}

  async execute(dto: CreateTodoDto): Promise<TodoResponseDto> {
    const todo = await this.todoRepository.create({
      userId: dto.user_id,
      title: dto.title,
      description: dto.description,
      priority: dto.priority || 'medium',
      dueDate: dto.due_date ? new Date(dto.due_date) : null,
      status: 'pending',
    });

    return TodoResponseDto.fromEntity(todo);
  }
}
