import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { UsersService } from 'src/modules/users/users.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { hashData } from 'src/common/utils/hash.util';
import { User } from 'src/modules/users/entities/user.entity';
import { validatePasswordStrength } from 'src/common/utils/password.util';
import EmailUtil from 'src/common/utils/email.util';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const passwordMatches = await bcrypt.compare(pass, user.password);
    if (!passwordMatches) return null;
    if (!user.emailActive) {
      throw new BadRequestException(
        'Account not activated. Please check your email to verify.',
      );
    }
    if (!user.isActive) {
      throw new BadRequestException(
        'Your account is locked. Please contact support for assistance.',
      );
    }

    return user;
  }

  async signIn(user: User) {
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return {
      account: user,
      ...tokens,
    };
  }

  async signUp(createUserDto: CreateUserDto) {
    // Check if user exists
    const userExists = await this.usersService.findByEmail(createUserDto.email);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const errors = validatePasswordStrength(createUserDto.password);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // Hash password
    const hash = await hashData(createUserDto.password);
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hash,
    });
    const token = await this.generateVerificationToken(newUser.id);

    // const tokens = await this.getTokens(newUser.id, newUser.email);
    // await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    // return tokens;
    // const { password, refreshToken, ...user } = newUser;
    await EmailUtil.sendMail(
      newUser.email,
      'verify email',
      '',
      `Click to verify: ${this.configService.get('CLIENT_URL')}/verify-email?token=${token}, The link will be active for 1 hour.`,
    );
    // return {
    //   account: newUser,
    //   ...tokens,
    // };
  }

  private async generateVerificationToken(userId: string) {
    return await this.jwtService.signAsync(
      { userId: userId },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '1h',
      },
    );
  }

  async verifyEmail(token: string) {
    let decoded: any;
    try {
      decoded = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new BadRequestException('Token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new BadRequestException('Invalid token');
      } else {
        throw new BadRequestException('Could not verify token');
      }
    }
    const user = await this.usersService.findById(decoded.userId);
    if (!user) throw new BadRequestException('User not found');
    user.emailActive = true;
    await this.usersService.update(user.id, user);
  }

  async logout(userId: string) {
    return await this.usersService.update(userId, { refreshToken: null });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await hashData(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    const accessTokenExpiresIn = this.configService.get<string>(
      'JWT_ACCESS_EXPIRES_IN',
    );
    const refreshTokenExpiresIn = this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
    );

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: accessTokenExpiresIn,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: refreshTokenExpiresIn,
      }),
    ]);

    const accessTokenExpiresAt =
      this.calculateExpirationDate(accessTokenExpiresIn);
    const refreshTokenExpiresAt = this.calculateExpirationDate(
      refreshTokenExpiresIn,
    );
    return {
      accessToken,
      accessTokenExpiresAt,
      refreshToken,
      refreshTokenExpiresAt,
    };
  }

  private calculateExpirationDate(expiresIn: string): Date {
    const now = new Date();
    const seconds = this.parseTimeToSeconds(expiresIn);
    return new Date(now.getTime() + seconds * 1000);
  }

  private parseTimeToSeconds(timeString: string): number {
    // Xử lý các format như: '15m', '1h', '7d', '30s'
    const match = timeString.match(/^(\d+)([smhd])$/);
    if (!match) {
      // Nếu là số thuần túy, coi như đã là giây
      return parseInt(timeString, 10);
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 24 * 60 * 60;
      default:
        return parseInt(timeString, 10);
    }
  }

  async loginWithGoogle(user: any) {
    let userExists = await this.usersService.findByEmail(user.email);
    if (!userExists) {
      userExists = await this.usersService.create({
        email: user.email,
        password: '',
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.picture,
      });
    }
    const tokens = await this.getTokens(userExists.id, userExists.email);
    await this.updateRefreshToken(userExists.id, tokens.refreshToken);
    return {
      account: userExists,
      ...tokens,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let newPassword = this.generatePassword();
    const hashPassword = await hashData(newPassword);
    user.password = hashPassword;
    await this.usersService.update(user.id, user);

    await EmailUtil.sendMail(email, 'Password reset request', '', newPassword);
    return 'Password reset successfully';
  }

  private generatePassword() {
    const length = 10;

    const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
    const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*()_+';

    const allChars = lowerCase + upperCase + numbers + specialChars;

    let password = [
      lowerCase[Math.floor(Math.random() * lowerCase.length)],
      upperCase[Math.floor(Math.random() * upperCase.length)],
      numbers[Math.floor(Math.random() * numbers.length)],
      specialChars[Math.floor(Math.random() * specialChars.length)],
    ];

    for (let i = password.length; i < length; i++) {
      password.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }

    password = password.sort(() => 0.5 - Math.random());

    return password.join('');
  }
}
