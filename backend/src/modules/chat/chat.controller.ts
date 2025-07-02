import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  ValidationPipe,
  Put,
} from '@nestjs/common';
import { ChatService } from './services/chat.service';
import { CreateChatDto, FindChatDto, UpdateReactionDto } from './dto/chat.dto';
import { ChatSessionService } from 'src/modules/chat/services/chat-session.service';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage, File } from 'multer';
import { extname } from 'path';
import {
  CreateChatSessionDto,
  RenameChatSessionDto,
  SessionIdDto,
} from 'src/modules/chat/dto/chat-session.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly sessionService: ChatSessionService,
  ) {}

  @Post('message')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 3 }], {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(
    @Body() createChatDto: CreateChatDto,
    @GetUser('sub') userId,
    @UploadedFiles() files: { images?: File[] },
  ) {
    await this.sessionService.updateLastActivity(createChatDto.chatSessionId);
    return this.chatService.create(createChatDto, userId, files?.images);
  }

  @Post('message/find-all')
  findAll(@GetUser('sub') userId: string, @Body() dto: FindChatDto) {
    return this.chatService.findAll(userId, dto);
  }

  @Get('message/:id')
  findChatsBySession(
    @Param(ValidationPipe) sessionIdDto: SessionIdDto,
    @GetUser('sub') userId,
  ) {
    return this.chatService.findBySession(sessionIdDto, userId);
  }

  @Put('message/react/:id')
  reactMessage(@Param('id') id: string, @Body() dto: UpdateReactionDto) {
    return this.chatService.reactMessage(id, dto);
  }

  @Post('session')
  createChatSession(
    @Body() createChatSession: CreateChatSessionDto,
    @GetUser('sub') userId,
  ) {
    return this.sessionService.create(createChatSession, userId);
  }

  @Post('session/find-all')
  findChatSession(
    @Body() paginationDto: PaginationDto,
    @GetUser('sub') userId,
  ) {
    return this.sessionService.findWithPagination(paginationDto, userId);
  }

  @Delete('session/:ids')
  removeChatSession(@Param('ids') idsParam: string) {
    const ids = idsParam.split(',');
    return this.sessionService.remove(ids);
  }

  @Put('session/rename/:id')
  renameChatSession(
    @Param('id') id: string,
    @Body() dto: RenameChatSessionDto,
  ) {
    return this.sessionService.rename(id, dto.sessionName);
  }
}
