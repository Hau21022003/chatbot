import { Module } from '@nestjs/common';
import { ChatService } from './services/chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatSession } from 'src/modules/chat/entities/chat-session.entity';
import { Chat } from 'src/modules/chat/entities/chat.entity';
import { ChatSessionService } from 'src/modules/chat/services/chat-session.service';
import { ClaudeService } from 'src/modules/chat/services/claude.service';
import { DownloadModule } from 'src/modules/download/download.module';
import { UsageModule } from 'src/modules/usage/usage.module';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [
    DownloadModule,
    UsageModule,
    UsersModule,
    TypeOrmModule.forFeature([ChatSession, Chat]),
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatSessionService, ClaudeService],
})
export class ChatModule {}
