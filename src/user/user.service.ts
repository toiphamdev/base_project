import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserCreateDto } from './dto/user-create.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  getUservalidate(email: string): Promise<User> {
    return this.userRepo.findOne({
      where: {
        email,
      },
    });
  }

  async createUser(user: UserCreateDto): Promise<{ message: string }> {
    try {
      const isExistEmail = await this.userRepo.exist({
        where: { email: user.email },
      });
      if (isExistEmail) {
        throw new Error('Tài khoản đã tồn tại!');
      }
      const saltRounds = 10;
      const password = await bcrypt.hashSync(user.password, saltRounds);
      user.password = password;
      await this.userRepo.save({
        ...user,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return {
        message: 'Success',
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        error.message ? error.message : 'Oh! Có gì đó đã bị lỗi',
      );
    }
  }
}
