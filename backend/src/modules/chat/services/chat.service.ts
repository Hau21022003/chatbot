import { Injectable } from '@nestjs/common';
import { ChatType, CreateChatDto } from '../dto/create-chat.dto';
import { UpdateChatDto } from '../dto/update-chat.dto';
import { File } from 'multer';
import { ClaudeService } from 'src/modules/chat/services/claude.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from 'src/modules/chat/entities/chat.entity';
import { Repository } from 'typeorm';
import { SessionIdDto } from 'src/modules/chat/dto/chat-session.dto';

@Injectable()
export class ChatService {
  constructor(
    private claudeService: ClaudeService,
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
  ) {}

  async create(createChatDto: CreateChatDto, userId: string, images?: File[]) {
    const systemPrompt =
      createChatDto.type == ChatType.GEN_CODE_WEB
        ? 'you are web frontend developer'
        : undefined;
    const chatbotResponse = await this.claudeService.generateResponse(
      createChatDto.message,
      systemPrompt,
      images,
    );

    const newUserChat = this.chatRepository.create({
      sender: 'user',
      message: createChatDto.message,
      sessionId: createChatDto.chatSessionId,
      userId: userId,
      metadata: { images: images?.map((image) => image.path) },
    });

    const newBotChat = this.chatRepository.create({
      sender: 'bot',
      message: chatbotResponse.content,
      sessionId: createChatDto.chatSessionId,
      userId: userId,
    });

    const result = await this.chatRepository.save([newUserChat, newBotChat]);
    return result[1];
  }

  async findBySession(sessionIdDto: SessionIdDto) {
    return this.chatRepository.find({
      where: { sessionId: sessionIdDto.id },
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
