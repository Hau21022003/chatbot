import { IsEnum, IsNotEmpty } from 'class-validator';

export enum ReactType {
  LIKE = 'like',
  DISLIKE = 'dislike',
  NONE = 'none',
}

export class ReactCommentDto {
  @IsNotEmpty()
  @IsEnum(ReactType)
  type: ReactType;
}
