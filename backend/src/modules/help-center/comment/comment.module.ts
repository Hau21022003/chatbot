import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentReaction } from 'src/modules/help-center/comment/entities/comment-reaction.entity';
import { Comment } from 'src/modules/help-center/comment/entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, CommentReaction])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
