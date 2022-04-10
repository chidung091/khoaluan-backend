import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional } from 'class-validator'

export class DetailUsersMonitorDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  studentId: number
}
