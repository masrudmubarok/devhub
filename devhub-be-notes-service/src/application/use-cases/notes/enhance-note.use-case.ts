import { Injectable, Inject } from '@nestjs/common';
import { IAiService } from '../../domain/services/ai.service.interface';
import { AiEnhanceDto, AiEnhanceResponseDto } from '../dtos/note.dto';

@Injectable()
export class EnhanceNoteUseCase {
  constructor(
    @Inject('IAiService')
    private readonly aiService: IAiService,
  ) {}

  async execute(dto: AiEnhanceDto): Promise<AiEnhanceResponseDto> {
    const result = await this.aiService.enhanceNote(dto.action, dto.content);
    
    return {
      result,
      action: dto.action,
    };
  }
}
