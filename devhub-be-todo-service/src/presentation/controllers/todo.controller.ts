import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTodoDto, UpdateTodoDto } from '../../application/dtos/todo.dto';
import { CreateTodoUseCase } from '../../application/use-cases/create-todo.use-case';
import { UpdateTodoUseCase } from '../../application/use-cases/update-todo.use-case';
import { GetTodosUseCase } from '../../application/use-cases/get-todos.use-case';
import { DeleteTodoUseCase } from '../../application/use-cases/delete-todo.use-case';
import { GetTodoStatsUseCase } from '../../application/use-cases/get-todo-stats.use-case';

@Controller('todos')
export class TodoController {
  constructor(
    private readonly createTodoUseCase: CreateTodoUseCase,
    private readonly updateTodoUseCase: UpdateTodoUseCase,
    private readonly getTodosUseCase: GetTodosUseCase,
    private readonly deleteTodoUseCase: DeleteTodoUseCase,
    private readonly getTodoStatsUseCase: GetTodoStatsUseCase,
  ) {}

  @Get()
  async findAll(
    @Query('user_id', ParseIntPipe) userId: number,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
  ) {
    return await this.getTodosUseCase.execute(userId, status, priority);
  }

  @Get('stats')
  async getStats(@Query('user_id', ParseIntPipe) userId: number) {
    return await this.getTodoStatsUseCase.execute(userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) createTodoDto: CreateTodoDto) {
    return await this.createTodoUseCase.execute(createTodoDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Query('user_id', ParseIntPipe) userId: number,
    @Body(ValidationPipe) updateTodoDto: UpdateTodoDto,
  ) {
    return await this.updateTodoUseCase.execute(id, userId, updateTodoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Query('user_id', ParseIntPipe) userId: number,
  ) {
    await this.deleteTodoUseCase.execute(id, userId);
  }
}
