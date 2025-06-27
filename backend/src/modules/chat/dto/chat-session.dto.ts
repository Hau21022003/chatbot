import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { IsExists } from 'src/common/decorators/is-exists.decorator';
import { ChatSession } from 'src/modules/chat/entities/chat-session.entity';

export class SessionIdDto {
  @IsExists(ChatSession, 'id')
  id: string;
}

export class RemoveSessionsDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one session is required to delete' })
  @ValidateNested({ each: true })
  @Type(() => SessionIdDto)
  ids: SessionIdDto[];
}
