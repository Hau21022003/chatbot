import Anthropic from '@anthropic-ai/sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import { File } from 'multer';

@Injectable()
export class ClaudeService {
  private readonly client: Anthropic;

  constructor(private readonly configService: ConfigService) {
    this.client = new Anthropic({
      apiKey: this.configService.get('ANTHROPIC_API_KEY'),
    });
  }
  async generateResponse(
    message: string,
    systemPrompt?: string,
    images?: File[],
  ) {
    const content: any[] = [];

    if (images && images.length > 0) {
      const imageContents = await Promise.all(
        images.map(async (file) => {
          const base64 = await this.imageToBase64(file);
          return {
            type: 'image',
            source: {
              type: 'base64',
              media_type: this.getMediaType(file),
              data: base64,
            },
          };
        }),
      );

      content.push(...imageContents);
    }

    content.push({
      type: 'text',
      text: message,
    });

    const params: Anthropic.MessageCreateParams = {
      max_tokens: parseInt(this.configService.get('ANTHROPIC_MAX_TOKENS'), 10),
      messages: [{ role: 'user', content: content }],
      model: this.configService.get('ANTHROPIC_MODEL'),
    };

    if (systemPrompt) {
      params.system = systemPrompt;
    }

    try {
      const message: Anthropic.Message =
        await this.client.messages.create(params);

      return {
        content:
          message.content[0].type === 'text' ? message.content[0].text : '',
        usage: {
          inputTokens: message.usage.input_tokens,
          outputTokens: message.usage.output_tokens,
          totalTokens: message.usage.input_tokens + message.usage.output_tokens,
        },
        model: message.model,
        created_at: new Date(),
      };
    } catch (error) {
      throw error;
    }
  }

  private async imageToBase64(file: File) {
    const fileBuffer = await fs.readFile(file.path);
    const base64 = fileBuffer.toString('base64');
    return base64;
  }

  private getMediaType(file: File): string {
    const extension = file.path.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      case 'webp':
        return 'image/webp';
      default:
        return 'image/jpeg';
    }
  }
}
