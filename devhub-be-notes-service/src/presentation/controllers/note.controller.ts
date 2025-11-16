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
import { CreateNoteDto, UpdateNoteDto, AiEnhanceDto } from '../../application/dtos/note.dto';
import { CreateNoteUseCase } from '../../application/use-cases/notes/create-note.use-case';
import { GetNotesUseCase } from '../../application/use-cases/notes/get-notes.use-case';
import { SearchNotesUseCase } from '../../application/use-cases/notes/search-notes.use-case';
import { EnhanceNoteUseCase } from '../../application/use-cases/notes/enhance-note.use-case';

@Controller('notes')
export class NoteController {
  constructor(
    private readonly createNoteUseCase: CreateNoteUseCase,
    private readonly getNotesUseCase: GetNotesUseCase,
    private readonly searchNotesUseCase: SearchNotesUseCase,
    private readonly enhanceNoteUseCase: EnhanceNoteUseCase,
  ) {}

  @Get()
  async findAll(
    @Query('user_id', ParseIntPipe) userId: number,
    @Query('category') category?: string,
  ) {
    return await this.getNotesUseCase.execute(userId, category);
  }

  @Get('search')
  async search(
    @Query('user_id', ParseIntPipe) userId: number,
    @Query('q') query: string,
  ) {
    return await this.searchNotesUseCase.execute(userId, query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) createNoteDto: CreateNoteDto) {
    return await this.createNoteUseCase.execute(createNoteDto);
  }

  @Post('ai-enhance')
  async aiEnhance(@Body(ValidationPipe) aiEnhanceDto: AiEnhanceDto) {
    return await this.enhanceNoteUseCase.execute(aiEnhanceDto);
  }
}
