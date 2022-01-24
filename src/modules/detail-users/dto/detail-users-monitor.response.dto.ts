import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { BaseDto } from 'src/common/dto'

export class DetailUsersMonitorResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  userID: number

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string
}
