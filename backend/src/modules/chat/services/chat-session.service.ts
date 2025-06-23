import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatSession } from 'src/modules/chat/entities/chat-session.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatSessionService {
  constructor(
    @InjectRepository(ChatSession)
    private chatSessionRepository: Repository<ChatSession>,
  ) {}

  async create(sessionName: string, userId: string) {
    const chatSession = this.chatSessionRepository.create({
      sessionName: sessionName,
      lastActivity: new Date(),
      userId: userId,
    });

    return await this.chatSessionRepository.save(chatSession);
  }

  async findAll() {
    return await this.chatSessionRepository.find();
  }

  async rename(sessionId: string, newName: string) {
    return await this.chatSessionRepository.update(sessionId, {
      sessionName: newName,
    });
  }

  async updateLastActivity(sessionId: string) {
    return await this.chatSessionRepository.update(sessionId, {
      lastActivity: new Date(),
    });
  }

  async remove(id: string) {
    return await this.chatSessionRepository.delete(id);
  }
}
