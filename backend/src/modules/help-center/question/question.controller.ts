import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { FindAllDto } from 'src/modules/help-center/question/dto/find-all.dto';
import { diskStorage, File } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { getDownloadUrl } from 'src/common/utils/url.utils';
import * as path from 'path';

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

  @Post('find-all')
  findAll(@Body() findAllDto: FindAllDto, @GetUser('sub') userId: string) {
    return this.questionService.findAll(findAllDto, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('sub') userId) {
    return this.questionService.findOne(+id, userId);
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
  remove(@Param('id') id: string, @GetUser('sub') userId: string) {
    return this.questionService.remove(+id, userId);
  }

  @Post('upload-image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadImage(@UploadedFile() image: File) {
    return { imageUrl: getDownloadUrl(path.basename(image.path)) };
  }
}
