import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateUsersDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  userID: number

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  email: string
}

export class CreateUsersWithOutEmailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  userID: number

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string
}
