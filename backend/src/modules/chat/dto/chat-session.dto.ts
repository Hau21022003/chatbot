import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IsExists } from 'src/common/decorators/is-exists.decorator';
import { ChatSession } from 'src/modules/chat/entities/chat-session.entity';

export class SessionIdDto {
  @IsExists(ChatSession, 'id')
  id: string;
}

export class CreateChatSessionDto {
  @IsNotEmpty()
  @IsString()
  sessionName?: string;
}

export class RenameChatSessionDto extends PartialType(CreateChatSessionDto) {}
