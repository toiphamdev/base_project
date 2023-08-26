import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}
  async validateUser(email: string, password: string): Promise<User> {
    const user: User = await this.userService.getUservalidate(email);
    if (user) {
      const checkPassword = bcrypt.compareSync(password, user.password);
      if (checkPassword) {
        return user;
      } else {
        throw new UnauthorizedException(
          'Tài khoản hoặc mật khẩu không chính xác!',
        );
      }
    } else {
      throw new UnauthorizedException(
        'Tài khoản hoặc mật khẩu không chính xác!',
      );
    }
  }
  generateToken(email: string, id: number): string {
    const accessToken = this.jwtService.sign(
      { email, id },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('EX_TIME_ACCESS'),
      },
    );
    return accessToken;
  }
  generateTokenEmail(email: string): string {
    const accessToken = this.jwtService.sign(
      { email },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('EX_TIME_VERIFY'),
      },
    );
    return accessToken;
  }
  savedCookie(email: string, id: number, res: Response): void {
    const refreshToken = this.jwtService.sign(
      { email, id },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('EX_TIME_REFRESH'),
      },
    );
    res.cookie('refreshToken', refreshToken, {
      maxAge: 12 * 3600 * 1000,
      httpOnly: true,
    });
  }
  clearCookie(res: Response): void {
    res.clearCookie('refreshToken');
  }

  async logout(res: Response) {
    try {
      this.clearCookie(res);
      return res.json({
        message: 'success',
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Oh! Có gì đó đã bị lỗi');
    }
  }
  async decode(token: string) {
    return this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }
}
