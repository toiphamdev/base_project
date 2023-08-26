import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class UserCreateDto {
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;
  @IsNotEmpty()
  @ApiProperty()
  lastName: string;
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
