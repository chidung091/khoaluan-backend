import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class DetailUsersHeadMasterDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  studentId: number
}
