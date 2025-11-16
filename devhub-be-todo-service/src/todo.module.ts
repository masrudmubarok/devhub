import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './domain/entities/todo.entity';
import { TodoRepository } from './infrastructure/repositories/todo.repository';
import { TodoController } from './presentation/controllers/todo.controller';
import { CreateTodoUseCase } from './application/use-cases/create-todo.use-case';
import { UpdateTodoUseCase } from './application/use-cases/update-todo.use-case';
import { GetTodosUseCase } from './application/use-cases/get-todos.use-case';
import { DeleteTodoUseCase } from './application/use-cases/delete-todo.use-case';
import { GetTodoStatsUseCase } from './application/use-cases/get-todo-stats.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([Todo])],
  controllers: [TodoController],
  providers: [
    {
      provide: 'ITodoRepository',
      useClass: TodoRepository,
    },
    CreateTodoUseCase,
    UpdateTodoUseCase,
    GetTodosUseCase,
    DeleteTodoUseCase,
    GetTodoStatsUseCase,
  ],
  exports: ['ITodoRepository'],
})
export class TodoModule {}
