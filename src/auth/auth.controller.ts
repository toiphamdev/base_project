import {
  Controller,
  Req,
  Post,
  UseGuards,
  Res,
  Get,
  ForbiddenException,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard, LocalAuthGuard } from './guard';
import { AuthService } from './auth.service';
import { JwtCookieAuthGuard } from './guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  LoginDto,
  ResponseLoginDto,
  ResponseRereshTokenDto,
} from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Đăng nhập' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, type: ResponseLoginDto })
  @ApiUnauthorizedResponse({ description: 'Đăng nhập thất bại' })
  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Req() req: Request, @Res() res: Response) {
    try {
      const user = req.user;
      const accessToken = this.authService.generateToken(
        user['email'],
        user['id'],
      );
      this.authService.savedCookie(user['email'], user['id'], res);
      return res.status(200).json({
        accessToken,
        user,
      });
    } catch (error) {
      throw new BadRequestException('Xin lỗi! Đã có lỗi xảy ra!');
    }
  }

  @ApiCookieAuth('refreshToken')
  @ApiOperation({ summary: 'Lấy lại accessToken khi token hết hạn' })
  @ApiResponse({ status: 200, type: ResponseRereshTokenDto })
  @ApiForbiddenResponse({ description: 'Xin lỗi! Đã có lỗi xảy ra!' })
  @Get('refresh')
  @UseGuards(new JwtCookieAuthGuard('jwt-cookie'))
  getAccessToken(@Req() req: Request): { accessToken: string } {
    try {
      const user = req.user;
      const accessToken = this.authService.generateToken(
        user['email'],
        user['id'],
      );
      return {
        accessToken,
      };
    } catch (error) {
      throw new BadRequestException('Xin lỗi! Đã có lỗi xảy ra!');
    }
  }

  @ApiOperation({ summary: 'User logout method' })
  @ApiBearerAuth()
  @Patch('/logout')
  @UseGuards(JwtAuthGuard)
  logout(@Res() res: Response) {
    return this.authService.logout(res);
  }
}
