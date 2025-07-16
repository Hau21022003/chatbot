import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'src/modules/help-center/question/entities/question.entity';
import { Repository } from 'typeorm';
import { FindAllDto } from 'src/modules/help-center/question/dto/find-all.dto';
import { createPaginationResult } from 'src/common/interfaces/pagination-result.interface';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto, userId: string) {
    const question = this.questionsRepository.create({
      ...createQuestionDto,
      authorId: userId,
    });
    return this.questionsRepository.save(question);
  }

  async findAll(findAllDto: FindAllDto, userId: string) {
    const { pageNumber, pageSize, sortBy, type, offset, searchQuery } =
      findAllDto;

    const query = await this.questionsRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.author', 'author')
      .addSelect(
        'CASE WHEN question.authorId = :currentUserId THEN 1 ELSE 0 END',
        'is_owner',
      )
      .setParameter('currentUserId', userId)
      .where('question.title LIKE :searchQuery', {
        searchQuery: `%${searchQuery || ''}%`,
      });

    if (type === 'my post') {
      query.andWhere('question.authorId = :userId', { userId });
    }

    if (type === 'pinned') {
      query.andWhere('question.pinned = true');
    }

    if (type === 'others') {
      query.andWhere('question.authorId != :currentUserId');
    }

    if (sortBy === 'most useful') {
      query
        .orderBy('question.commentCount', 'DESC')
        .addOrderBy('question.createdAt', 'DESC');
    } else {
      query
        .orderBy('question.pinned', 'ASC')
        .addOrderBy('is_owner', 'DESC')
        .addOrderBy('question.createdAt', 'DESC');
    }

    query.skip(offset).take(pageSize);

    const [questions, total] = await query.getManyAndCount();

    return createPaginationResult<Question>(questions, {
      total: total,
      pageNumber: pageNumber,
      pageSize: pageSize,
    });
  }

  async findOne(id: number, userId: string) {
    const question = await this.questionsRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.author', 'author')
      .leftJoinAndSelect('question.comments', 'comments')
      .leftJoinAndSelect('comments.author', 'commentAuthor')
      .leftJoinAndSelect('comments.reactions', 'commentReactions')
      .where('question.id = :id', { id })
      .orderBy('comments.createdAt', 'DESC')
      .getOne();
    if (!question) {
      throw new BadRequestException('Question not found');
    }

    question.comments = question.comments.map((comment) => {
      // Đếm like/dislike
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
    });
    return question;
  }

  async update(
    id: number,
    updateQuestionDto: UpdateQuestionDto,
    userId: string,
  ) {
    const question = await this.questionsRepository.findOne({
      where: { id, authorId: userId },
    });
    if (!question) {
      throw new BadRequestException(
        'Question not found or you are not the author',
      );
    }
    return this.questionsRepository.save({
      ...question,
      ...updateQuestionDto,
    });
  }

  async remove(id: number, userId: string) {
    const question = await this.questionsRepository.findOne({
      where: { id, authorId: userId },
    });
    if (!question) {
      throw new BadRequestException(
        'Question not found or you are not the author',
      );
    }
    return this.questionsRepository.remove(question);
  }
}
