import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserType } from 'src/modules/users/entities/user.entity';
import { In, Like, Repository } from 'typeorm';
import { UpdatePasswordDto } from 'src/modules/users/dto/update-profile.dto';
import { compareHash, hashData } from 'src/common/utils/hash.util';
import { validatePasswordStrength } from 'src/common/utils/password.util';
import { File } from 'multer';
import * as path from 'path';
import { use } from 'passport';
import { Cron } from '@nestjs/schedule';
import { FindAllDto, UserStatus } from 'src/modules/users/dto/find-all.dto';
import { createPaginationResult } from 'src/common/interfaces/pagination-result.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string) {
    return await this.usersRepository.findOne({
      where: { email: email },
    });
  }

  async findById(id: string) {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);

    if (!user.firstName && user.email) {
      const [localPart] = user.email.split('@');
      const [first, last] = localPart.split('.');
      user.firstName = this.capitalize(first);
      user.lastName = last ? this.capitalize(last) : '';
    } else {
      user.firstName = createUserDto.firstName;
      user.lastName = createUserDto.lastName;
    }
    user.avatar = createUserDto.avatar;
    user.remainingPoints = 100;
    user.emailActive = false;

    return await this.usersRepository.save(user);
  }

  // Hàm hỗ trợ viết hoa chữ cái đầu
  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  findAll() {
    return this.usersRepository.find();
  }

  async update(id: string, updateData: Partial<User>) {
    await this.usersRepository.update(id, updateData);
    return this.usersRepository.findOneOrFail({ where: { id } });
  }

  async updateMany(users: User[]) {
    await this.usersRepository.save(users);
  }

  async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    const isCurrentPasswordValid = await compareHash(
      updatePasswordDto.currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const errors = validatePasswordStrength(updatePasswordDto.newPassword);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    user.password = await hashData(updatePasswordDto.newPassword);
    return this.usersRepository.save(user);
  }

  async updateProfileAvatar(userId: string, image: File) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    user.avatar = path.basename(image.path);

    return this.usersRepository.save(user);
  }

  async removeAvatar(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    user.avatar = null;
    return this.usersRepository.save(user);
  }

  async findAllWithPagination(dto: FindAllDto) {
    const { offset, userStatus, userType, pageNumber, pageSize, searchQuery } =
      dto;

    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    // Add status filter
    if (userStatus && userStatus !== UserStatus.ALL) {
      if (userStatus === UserStatus.ACTIVE) {
        queryBuilder.andWhere('user.isActive = :isActive', { isActive: true });
      }
      if (userStatus === UserStatus.INACTIVE) {
        queryBuilder.andWhere('user.isActive = :isActive', { isActive: false });
      }
    }

    // Add user type filter
    if (userType) {
      queryBuilder.andWhere('user.userType = :userType', { userType });
    }

    // Add search query with OR condition
    if (searchQuery) {
      queryBuilder.andWhere(
        '(user.firstName LIKE :searchQuery OR user.lastName LIKE :searchQuery OR user.email LIKE :searchQuery)',
        { searchQuery: `%${searchQuery}%` },
      );
    }

    // Add pagination
    queryBuilder.skip(offset).take(pageSize);

    const [items, count] = await queryBuilder.getManyAndCount();

    return createPaginationResult(items, {
      total: count,
      pageNumber,
      pageSize,
    });
  }

  async findByIds(ids: string[]) {
    return await this.usersRepository.find({ where: { id: In(ids) } });
  }

  @Cron('0 0 * * *') // chạy lúc 00:00 hằng ngày
  async resetUserType() {
    const today = new Date();
    try {
      const users = await this.usersRepository.find();
      const usersToUpdate = users.filter((user) => {
        return (
          user.userType === UserType.ENTERPRISE &&
          user.enterpriseExpiresAt &&
          new Date(user.enterpriseExpiresAt).getTime() < today.getTime()
        );
      });

      usersToUpdate.forEach((user) => {
        user.userType = UserType.FREE;
      });

      if (usersToUpdate.length > 0) {
        await this.usersRepository.save(usersToUpdate);
        console.log(`Reset ${usersToUpdate.length} user(s) về FREE`);
      }
    } catch (error) {
      console.error('Lỗi khi resetUserType: ', error);
    }
  }
}
