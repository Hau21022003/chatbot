import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  create(
    @Body() createQuestionDto: CreateQuestionDto,
    @GetUser('sub') userId: string,
  ) {
    return this.questionService.create(createQuestionDto, userId);
  }

  @Get()
  findAll() {
    return this.questionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
    @GetUser('sub') userId: string,
  ) {
    return this.questionService.update(+id, updateQuestionDto, userId);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @GetUser('sub') userId: string,
  ) {
    return this.questionService.remove(+id, userId);
  }
}
