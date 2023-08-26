import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserCreateDto } from './dto/user-create.dto';
import { ResponseCommonDto } from 'src/allcode/dto/api-response.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Đăng kí tài khoản' })
  @ApiBody({ type: UserCreateDto })
  @ApiResponse({ type: ResponseCommonDto })
  @Post()
  register(@Body() user: UserCreateDto): Promise<{ message: string }> {
    return this.userService.createUser(user);
  }
}
