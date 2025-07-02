import { PartialType } from '@nestjs/mapped-types';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { IsExists } from 'src/common/decorators/is-exists.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ChatSession } from 'src/modules/chat/entities/chat-session.entity';
import { ReactionType } from 'src/modules/chat/entities/chat.entity';

export enum ChatType {
  ASSISTANT = 'ASSISTANT',
  GEN_CODE_WEB = 'GEN_CODE_WEB',
}

export class CreateChatDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsUUID(4, { message: 'Session ID must be a valid UUID' })
  @IsExists(ChatSession, 'id', { message: 'Session does not exist' })
  chatSessionId: string;

  @IsOptional()
  @IsEnum(ChatType)
  type: ChatType;
}

export class UpdateReactionDto {
  @IsNotEmpty()
  @IsEnum(ReactionType)
  reaction: ReactionType;
}

export class FindChatDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search: string;
}
