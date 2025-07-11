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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import {
  UpdatePasswordDto,
  UpdateProfileDto,
} from 'src/modules/users/dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, File } from 'multer';
import { extname } from 'path';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@GetUser() user) {
    return user;
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.usersService.findAll();
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
}
