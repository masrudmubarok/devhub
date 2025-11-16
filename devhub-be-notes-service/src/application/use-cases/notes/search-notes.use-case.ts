import { Injectable, Inject } from '@nestjs/common';
import { INoteRepository } from '../../domain/repositories/note.repository.interface';
import { NoteResponseDto } from '../dtos/note.dto';

@Injectable()
export class SearchNotesUseCase {
  constructor(
    @Inject('INoteRepository')
    private readonly noteRepository: INoteRepository,
  ) {}

  async execute(userId: number, query: string): Promise<NoteResponseDto[]> {
    const notes = await this.noteRepository.search(userId, query);
    return notes.map(note => NoteResponseDto.fromEntity(note));
  }
}
