import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ITodoRepository } from '../../domain/repositories/todo.repository.interface';
import { UpdateTodoDto, TodoResponseDto } from '../dtos/todo.dto';

@Injectable()
export class UpdateTodoUseCase {
  constructor(
    @Inject('ITodoRepository')
    private readonly todoRepository: ITodoRepository,
  ) {}

  async execute(id: number, userId: number, dto: UpdateTodoDto): Promise<TodoResponseDto> {
    const existingTodo = await this.todoRepository.findById(id, userId);
    if (!existingTodo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }

    const updateData: any = {};
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.status !== undefined) updateData.status = dto.status;
    if (dto.priority !== undefined) updateData.priority = dto.priority;
    if (dto.due_date !== undefined) updateData.dueDate = new Date(dto.due_date);

    const updatedTodo = await this.todoRepository.update(id, userId, updateData);
    
    return TodoResponseDto.fromEntity(updatedTodo);
  }
}
