import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import { Role } from 'src/modules/users/users.enum'

export class ResponseAuthDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: number

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  token: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  role: Role
}
