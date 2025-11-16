import { IsString, IsNotEmpty, IsOptional, IsInt, IsArray } from 'class-validator';

export class CreateNoteDto {
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsArray()
  @IsOptional()
  tags?: string[];
}

export class UpdateNoteDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsArray()
  @IsOptional()
  tags?: string[];
}

export class NoteResponseDto {
  id: number;
  user_id: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
  created_at: Date;
  updated_at: Date;

  static fromEntity(note: any): NoteResponseDto {
    const dto = new NoteResponseDto();
    dto.id = note.id;
    dto.user_id = note.userId;
    dto.title = note.title;
    dto.content = note.content;
    dto.category = note.category;
    dto.tags = note.tags || [];
    dto.created_at = note.createdAt;
    dto.updated_at = note.updatedAt;
    return dto;
  }
}

export class AiEnhanceDto {
  @IsString()
  @IsNotEmpty()
  action: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}

export class AiEnhanceResponseDto {
  result: string;
  action: string;
}
