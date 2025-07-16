import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/modules/help-center/comment/entities/comment.entity';
import { Repository } from 'typeorm';
import { CommentReaction } from 'src/modules/help-center/comment/entities/comment-reaction.entity';
import { File } from 'multer';
import * as path from 'path';
import {
  ReactCommentDto,
  ReactType,
} from 'src/modules/help-center/comment/dto/react-comment.dto';
import { Question } from 'src/modules/help-center/question/entities/question.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(CommentReaction)
    private reactionRepository: Repository<CommentReaction>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    userId: string,
    images?: File[],
  ) {
    const comment = this.commentsRepository.create({
      ...createCommentDto,
      authorId: userId,
      images: images?.map((image) =>
        image.path ? path.basename(image.path) : undefined,
      ),
    });
    const savedComment = await this.commentsRepository.save(comment);

    await this.questionRepository.increment(
      { id: createCommentDto.questionId },
      'commentCount',
      1,
    );
    return this.findOne(savedComment.id, userId);
  }

  async remove(id: number, userId: string) {
    const comment = await this.commentsRepository.findOne({
      where: { id, authorId: userId },
    });
    if (!comment) {
      throw new BadRequestException(
        'Comment not found or you do not have permission to delete it',
      );
    }
    await this.questionRepository.increment({ id }, 'commentCount', 1);

    return this.commentsRepository.delete(id);
  }

  async reactComment(commentId: number, userId: string, dto: ReactCommentDto) {
    const comment = await this.commentsRepository.findOne({
      where: { id: commentId },
    });
    if (!comment) throw new BadRequestException('Comment not found');

    const { type } = dto;

    const existingReaction = await this.reactionRepository.findOne({
      where: { userId, commentId },
    });

    if (type === ReactType.NONE) {
      if (!existingReaction) {
        throw new BadRequestException('Comment reaction not found');
      }

      await this.reactionRepository.delete(existingReaction.id);
    } else {
      const reaction = existingReaction
        ? Object.assign(existingReaction, { type })
        : this.reactionRepository.create({ userId, commentId, type });

      await this.reactionRepository.save(reaction);
    }

    return this.findOne(commentId, userId);
  }

  async findOne(commentId: number, userId: string) {
    const comment = await this.commentsRepository.findOne({
      where: { id: commentId },
      relations: ['author', 'reactions'],
    });

    comment.likeCount = comment.reactions.reduce((count, reaction) => {
      return reaction.type === 'like' ? count + 1 : count;
    }, 0);

    comment.dislikeCount = comment.reactions.reduce((count, reaction) => {
      return reaction.type === 'dislike' ? count + 1 : count;
    }, 0);

    // Kiểm tra user đã like/dislike chưa
    comment.isLikedByCurrentUser = comment.reactions.some(
      (reaction) => reaction.type === 'like' && reaction.userId === userId,
    );

    comment.isDislikedByCurrentUser = comment.reactions.some(
      (reaction) => reaction.type === 'dislike' && reaction.userId === userId,
    );

    // ✅ Loại bỏ reactions để giảm payload
    delete comment.reactions;

    return comment;
  }
}
