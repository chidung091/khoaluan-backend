import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string
}
