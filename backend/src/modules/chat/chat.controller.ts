import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  ValidationPipe,
} from '@nestjs/common';
import { ChatService } from './services/chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ChatSessionService } from 'src/modules/chat/services/chat-session.service';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage, File } from 'multer';
import { extname } from 'path';
import {
  RemoveSessionsDto,
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
    if (!createChatDto.chatSessionId) {
      const newSession = await this.sessionService.create('Chat', userId);
      createChatDto.chatSessionId = newSession.id;
    }
    return this.chatService.create(createChatDto, userId, files?.images);
  }

  @Get('message/:id')
  findChatsBySession(@Param(ValidationPipe) sessionIdDto: SessionIdDto) {
    return this.chatService.findBySession(sessionIdDto);
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

  // @Get()
  // findAll() {
  //   return this.chatService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.chatService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
  //   return this.chatService.update(+id, updateChatDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.chatService.remove(+id);
  // }
}
