import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategy';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { JwtCookieStrategy } from './strategy';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [PassportModule, JwtModule, ConfigModule, UserModule],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtCookieStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
