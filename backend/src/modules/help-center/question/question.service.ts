import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'src/modules/help-center/question/entities/question.entity';
import { Repository } from 'typeorm';

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

  async findAll() {
    return this.questionsRepository.find();
  }

  findOne(id: number) {
    return this.questionsRepository.findOne({
      where: { id },
      relations: ['comments'],
    });
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
