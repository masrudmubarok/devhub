import { IsString, IsNotEmpty, IsOptional, IsInt, IsArray } from 'class-validator';

export class CreateSnippetDto {
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  tags?: string[];
}

export class UpdateSnippetDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  language?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  tags?: string[];
}

export class SnippetResponseDto {
  id: number;
  user_id: number;
  title: string;
  code: string;
  language: string;
  description: string;
  tags: string[];
  created_at: Date;
  updated_at: Date;

  static fromEntity(snippet: any): SnippetResponseDto {
    const dto = new SnippetResponseDto();
    dto.id = snippet.id;
    dto.user_id = snippet.userId;
    dto.title = snippet.title;
    dto.code = snippet.code;
    dto.language = snippet.language;
    dto.description = snippet.description;
    dto.tags = snippet.tags || [];
    dto.created_at = snippet.createdAt;
    dto.updated_at = snippet.updatedAt;
    return dto;
  }
}
