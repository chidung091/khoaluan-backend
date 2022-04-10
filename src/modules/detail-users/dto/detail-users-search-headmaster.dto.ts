import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional } from 'class-validator'

export class DetailUsersHeadMasterDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  studentId: number
}
