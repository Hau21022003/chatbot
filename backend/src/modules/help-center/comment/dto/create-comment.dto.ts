import { IsNotEmpty, IsString } from 'class-validator';
import { IsExists } from 'src/common/decorators/is-exists.decorator';
import { Question } from 'src/modules/help-center/question/entities/question.entity';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsExists(Question, 'id')
  questionId: number;
}
