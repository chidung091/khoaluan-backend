import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class DetailUsersMonitorDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  studentId: number
}
