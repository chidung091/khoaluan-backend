import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class ConfirmResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  newPassword: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  token: string
}
