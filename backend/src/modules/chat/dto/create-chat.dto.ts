import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { IsExists } from 'src/common/decorators/is-exists.decorator';
import { ChatSession } from 'src/modules/chat/entities/chat-session.entity';

export enum ChatType {
  ASSISTANT = 'ASSISTANT',
  GEN_CODE_WEB = 'GEN_CODE_WEB',
}

export class CreateChatDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsOptional()
  @IsUUID(4, { message: 'Session ID must be a valid UUID' })
  @IsExists(ChatSession, 'id', { message: 'Session does not exist' })
  chatSessionId: string;

  @IsOptional()
  @IsEnum(ChatType)
  type: ChatType;
}
