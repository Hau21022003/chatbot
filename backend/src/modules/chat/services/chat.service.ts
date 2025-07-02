import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ChatType,
  CreateChatDto,
  FindChatDto,
  UpdateReactionDto,
} from '../dto/chat.dto';
import { File } from 'multer';
import { ClaudeService } from 'src/modules/chat/services/claude.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat, SenderType } from 'src/modules/chat/entities/chat.entity';
import { Repository } from 'typeorm';
import { SessionIdDto } from 'src/modules/chat/dto/chat-session.dto';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { DownloadService } from 'src/modules/download/download.service';
import { UsageService } from 'src/modules/usage/usage.service';
import { UsersService } from 'src/modules/users/users.service';
import { createPaginationMeta } from 'src/common/interfaces/pagination-result.interface';
import { FindChatRes } from 'src/modules/chat/interfaces/find-chat-res.interface';

@Injectable()
export class ChatService {
  constructor(
    private claudeService: ClaudeService,
    private downloadService: DownloadService,
    private usageService: UsageService,
    private usersService: UsersService,
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
  ) {}

  async create(createChatDto: CreateChatDto, userId: string, images?: File[]) {
    const user = await this.usersService.findById(userId);
    const remainingPoints = Number(user.remainingPoints);
    if (remainingPoints === 0)
      throw new BadRequestException('You have no remaining points');

    const systemPrompt =
      createChatDto.type == ChatType.GEN_CODE_WEB
        ? 'you are web frontend developer'
        : undefined;
    const { content, usage } = await this.claudeService.generateResponse(
      createChatDto.message,
      systemPrompt,
      images,
    );

    await this.usageService.updateDailyUsage(
      userId,
      usage.inputTokens,
      usage.outputTokens,
    );

    const newUserChat = this.chatRepository.create({
      sender: SenderType.USER,
      message: createChatDto.message,
      sessionId: createChatDto.chatSessionId,
      userId: userId,
      metadata: {
        images: images?.map((image) =>
          image.path ? path.basename(image.path) : undefined,
        ),
      },
    });

    const newBotChat = this.chatRepository.create({
      sender: SenderType.BOT,
      message: content,
      sessionId: createChatDto.chatSessionId,
      userId: userId,
    });

    const chats = await this.chatRepository.save([newUserChat, newBotChat]);
    const result = this.mapChatsWithDownloadUrls(chats);
    return result;
  }

  async findBySession(sessionIdDto: SessionIdDto, userId: string) {
    const chats = await this.chatRepository.find({
      where: { sessionId: sessionIdDto.id, userId: userId },
      order: { createdAt: 'ASC', sender: 'ASC' },
    });

    const result = this.mapChatsWithDownloadUrls(chats);
    return result;
  }

  async findAll(userId: string, dto: FindChatDto) {
    const { pageNumber, pageSize, offset } = dto;
    const chats = await this.chatRepository.find({
      where: { userId: userId },
      order: {
        createdAt: 'ASC',
        sender: 'ASC',
      },
      relations: ['session'],
    });
    let result: FindChatRes[] = [];

    for (let i = 0; i < chats.length; i++) {
      const current = chats[i];
      const next = chats[i + 1];
      const { id, createdAt, session } = current;

      if (current.sender === 'user' && next?.sender === 'bot') {
        result.push({
          input: current.message,
          output: next.message,
          createdAt,
          id,
          sessionName: session.sessionName,
        });
        i++;
      }
    }
    if (dto.search) {
      result = result.filter(
        (item) =>
          item.input.includes(dto.search) || item.output.includes(dto.search),
      );
    }
    const pagedItems = result.slice(offset, offset + pageSize);
    const total = result.length;
    return {
      items: pagedItems,
      pageMeta: createPaginationMeta(total, pageNumber, pageSize),
    };
  }

  private mapChatsWithDownloadUrls(chats: Chat[]): Chat[] {
    return chats.map((chat) => {
      const images = this.downloadService.getDownloadUrls(
        chat.metadata?.images || [],
      );
      return { ...chat, metadata: { images } };
    });
  }

  async reactMessage(id: string, reactionDto: UpdateReactionDto) {
    return await this.chatRepository.update(id, reactionDto);
  }
}
