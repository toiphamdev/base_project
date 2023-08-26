import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @ApiOperation({ summary: 'Well come to Refrigeration App' })
  @ApiResponse({ status: 200, type: String })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
