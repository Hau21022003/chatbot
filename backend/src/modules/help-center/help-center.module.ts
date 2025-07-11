import { Module } from '@nestjs/common';
import { QuestionModule } from './question/question.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [QuestionModule, CommentModule],
})
export class HelpCenterModule {}
