import { Injectable, Inject } from '@nestjs/common';
import { INoteRepository } from '../../domain/repositories/note.repository.interface';
import { CreateNoteDto, NoteResponseDto } from '../dtos/note.dto';

@Injectable()
export class CreateNoteUseCase {
  constructor(
    @Inject('INoteRepository')
    private readonly noteRepository: INoteRepository,
  ) {}

  async execute(dto: CreateNoteDto): Promise<NoteResponseDto> {
    const note = await this.noteRepository.create({
      userId: dto.user_id,
      title: dto.title,
      content: dto.content,
      category: dto.category || 'general',
      tags: dto.tags || [],
    });

    return NoteResponseDto.fromEntity(note);
  }
}
