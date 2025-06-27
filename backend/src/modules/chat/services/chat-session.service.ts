import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { createPaginationMeta } from 'src/common/interfaces/pagination-result.interface';
import { RemoveSessionsDto } from 'src/modules/chat/dto/chat-session.dto';
import { ChatSession } from 'src/modules/chat/entities/chat-session.entity';
import { In, Repository } from 'typeorm';

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

  async findWithPagination(paginationDto: PaginationDto, userId: string) {
    const { pageNumber, pageSize, offset } = paginationDto;
    // return await this.chatSessionRepository.find();
    const [data, total] = await this.chatSessionRepository.findAndCount({
      where: { userId: userId },
      skip: offset,
      take: pageSize,
      order: {
        lastActivity: 'ASC',
      },
    });
    return {
      items: data,
      pageMeta: createPaginationMeta(total, pageNumber, pageSize),
    };
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

  async remove(ids: string[]) {
    const count = await this.chatSessionRepository.count({
      where: { id: In(ids) },
    });
    if (count != ids.length) {
      throw new BadRequestException('Some session IDs do not exist or are invalid')
    }
    return await this.chatSessionRepository.delete({ id: In(ids) });
  }
}
