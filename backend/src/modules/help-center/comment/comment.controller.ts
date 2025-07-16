import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage, File } from 'multer';
import { extname } from 'path';
import { ReactCommentDto } from 'src/modules/help-center/comment/dto/react-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 3 }], {
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
  create(
    @Body() createCommentDto: CreateCommentDto,
    @GetUser('sub') userId: string,
    @UploadedFiles() files: { images?: File[] },
  ) {
    return this.commentService.create(createCommentDto, userId, files?.images);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('sub') userId: string) {
    return this.commentService.remove(+id, userId);
  }

  @Post('react-comment/:commentId')
  reactComment(
    @Param('commentId') commentId: number,
    @GetUser('sub') userId: string,
    @Body() dto: ReactCommentDto,
  ) {
    return this.commentService.reactComment(commentId, userId, dto);
  }
}
