import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { IAiService } from '../../domain/services/ai.service.interface';

@Injectable()
export class AiService implements IAiService {
  private readonly logger = new Logger(AiService.name);
  private readonly aiServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.aiServiceUrl = this.configService.get<string>('AI_SERVICE_URL') || 'http://localhost:8000';
  }

  async enhanceNote(action: string, content: string): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.aiServiceUrl}/notes/enhance`, {
          action,
          content,
        }),
      );

      return response.data.result;
    } catch (error) {
      this.logger.error(`Failed to enhance note: ${error.message}`);
      throw new Error('AI service unavailable');
    }
  }

  async generateTags(content: string): Promise<string[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.aiServiceUrl}/notes/generate-tags`, {
          content,
        }),
      );

      return response.data.tags;
    } catch (error) {
      this.logger.error(`Failed to generate tags: ${error.message}`);
      return [];
    }
  }
}
