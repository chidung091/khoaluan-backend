import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class DetailUsersMonitorResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  userID: number

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  studentScore: number

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  monitorScore: number
}
