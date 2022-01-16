import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class TimeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id: number

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  namHoc: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  maHK: number

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  tgSV: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  tgLT: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  tgGV: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  tgK: string
}
