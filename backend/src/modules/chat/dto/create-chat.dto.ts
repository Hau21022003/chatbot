import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsExists } from 'src/common/decorators/is-exists.decorator';
import { ChatSession } from 'src/modules/chat/entities/chat-session.entity';

export class CreateChatDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  @IsExists(ChatSession, 'id', { message: 'Session does not exist' })
  chatSessionId: string;
}
