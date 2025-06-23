import { Module } from '@nestjs/common';
import { ChatService } from './services/chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatSession } from 'src/modules/chat/entities/chat-session.entity';
import { Chat } from 'src/modules/chat/entities/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatSession, Chat])],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
