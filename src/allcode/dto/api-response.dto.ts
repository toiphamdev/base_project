import { ApiProperty } from '@nestjs/swagger';

export class ResponseCommonDto {
  @ApiProperty()
  message: string;
}
