import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/modules/help-center/comment/entities/comment.entity';
import { Repository } from 'typeorm';
import { CommentReaction } from 'src/modules/help-center/comment/entities/comment-reaction.entity';
import { File } from 'multer';
import * as path from 'path';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(CommentReaction)
    private commentReactionsRepository: Repository<CommentReaction>,
  ) {}

  create(createCommentDto: CreateCommentDto, userId: string, images?: File[]) {
    const comment = this.commentsRepository.create({
      ...createCommentDto,
      authorId: userId,
      images: images?.map((image) =>
        image.path ? path.basename(image.path) : undefined,
      ),
    });
    return this.commentsRepository.save(comment);
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
    return this.commentsRepository.delete(id);
  }
}
