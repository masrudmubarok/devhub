import { IsString, IsNotEmpty, IsOptional, IsEnum, IsInt, IsDateString } from 'class-validator';

export class CreateTodoDto {
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['low', 'medium', 'high'])
  @IsOptional()
  priority?: string;

  @IsDateString()
  @IsOptional()
  due_date?: string;
}

export class UpdateTodoDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['pending', 'in_progress', 'completed'])
  @IsOptional()
  status?: string;

  @IsEnum(['low', 'medium', 'high'])
  @IsOptional()
  priority?: string;

  @IsDateString()
  @IsOptional()
  due_date?: string;
}

export class TodoResponseDto {
  id: number;
  user_id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: Date | null;
  created_at: Date;
  updated_at: Date;

  static fromEntity(todo: any): TodoResponseDto {
    const dto = new TodoResponseDto();
    dto.id = todo.id;
    dto.user_id = todo.userId;
    dto.title = todo.title;
    dto.description = todo.description;
    dto.status = todo.status;
    dto.priority = todo.priority;
    dto.due_date = todo.dueDate;
    dto.created_at = todo.createdAt;
    dto.updated_at = todo.updatedAt;
    return dto;
  }
}

export class TodoStatsDto {
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
}
