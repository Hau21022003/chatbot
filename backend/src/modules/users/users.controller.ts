import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Put,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import {
  UpdatePasswordDto,
  UpdateProfileDto,
} from 'src/modules/users/dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, File } from 'multer';
import { extname } from 'path';
import { FindAllDto } from 'src/modules/users/dto/find-all.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { Response } from 'express';
import { ExcelHelper } from 'src/common/utils/excel.helper';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('find-all')
  @UseGuards(AdminGuard)
  findAll(@Body() dto: FindAllDto) {
    return this.usersService.findAllWithPagination(dto);
  }

  @Get('profile')
  getProfile(@GetUser('sub') userId: string) {
    return this.usersService.findById(userId);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Put('update-profile')
  updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @GetUser('sub') userId,
  ) {
    return this.usersService.update(userId, updateProfileDto);
  }

  @Put('update-password')
  updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @GetUser('sub') userId: string,
  ) {
    return this.usersService.updatePassword(userId, updatePasswordDto);
  }

  @Put('update-avatar')
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
  async updateProfileAvatar(
    @GetUser('sub') userId,
    @UploadedFile() image: File,
  ) {
    return this.usersService.updateProfileAvatar(userId, image);
  }

  @Get('remove-avatar')
  async removeAvatar(@GetUser('sub') userId: string) {
    return this.usersService.removeAvatar(userId);
  }

  @Public()
  @Get('export-users/:ids')
  async exportUsers(@Param('ids') ids: string, @Res() res: Response) {
    const idArray = ids.split(',');
    const data = await this.usersService.findByIds(idArray);
    return ExcelHelper.exportToExcel(
      data,
      [
        { header: 'ID', key: 'id' },
        { header: 'First Name', key: 'firstName' },
        { header: 'Last Name', key: 'lastName' },
        { header: 'Email', key: 'email' },
        { header: 'Active', key: 'isActive' },
        { header: 'Joined Date', key: 'createdAt' },
        { header: 'User Type', key: 'userType' },
      ],
      'users.xlsx',
      res,
    );
  }
}
