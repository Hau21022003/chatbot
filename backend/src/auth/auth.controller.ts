import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { RefreshTokenGuard } from 'src/auth/guards/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signin(@GetUser() user) {
    return this.authService.signIn(user);
  }

  @Get('logout')
  logout(@GetUser('sub') userId) {
    this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Request() req) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
