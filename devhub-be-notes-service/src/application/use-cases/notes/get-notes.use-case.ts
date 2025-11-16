import { Injectable, Inject } from '@nestjs/common';
import { INoteRepository } from '../../domain/repositories/note.repository.interface';
import { NoteResponseDto } from '../dtos/note.dto';

@Injectable()
export class GetNotesUseCase {
  constructor(
    @Inject('INoteRepository')
    private readonly noteRepository: INoteRepository,
  ) {}

  async execute(userId: number, category?: string): Promise<NoteResponseDto[]> {
    let notes;

    if (category) {
      notes = await this.noteRepository.findByCategory(userId, category);
    } else {
      notes = await this.noteRepository.findAll(userId);
    }

    return notes.map(note => NoteResponseDto.fromEntity(note));
  }
}
