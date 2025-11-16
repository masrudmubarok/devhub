import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { Note } from './domain/entities/note.entity';
import { Snippet } from './domain/entities/snippet.entity';
import { NoteRepository } from './infrastructure/repositories/note.repository';
import { SnippetRepository } from './infrastructure/repositories/snippet.repository';
import { AiService } from './infrastructure/services/ai.service';
import { NoteController } from './presentation/controllers/note.controller';
import { CreateNoteUseCase } from './application/use-cases/notes/create-note.use-case';
import { GetNotesUseCase } from './application/use-cases/notes/get-notes.use-case';
import { SearchNotesUseCase } from './application/use-cases/notes/search-notes.use-case';
import { EnhanceNoteUseCase } from './application/use-cases/notes/enhance-note.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([Note, Snippet]),
    HttpModule,
  ],
  controllers: [NoteController],
  providers: [
    {
      provide: 'INoteRepository',
      useClass: NoteRepository,
    },
    {
      provide: 'ISnippetRepository',
      useClass: SnippetRepository,
    },
    {
      provide: 'IAiService',
      useClass: AiService,
    },
    CreateNoteUseCase,
    GetNotesUseCase,
    SearchNotesUseCase,
    EnhanceNoteUseCase,
  ],
  exports: ['INoteRepository', 'ISnippetRepository', 'IAiService'],
})
export class NotesModule {}
