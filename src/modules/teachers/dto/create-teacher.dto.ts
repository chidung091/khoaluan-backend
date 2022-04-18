import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class CreateTableTeacherDto {
  @ApiProperty()
  @IsNumber()
  teacherNumber: number

  @ApiProperty()
  @IsString()
  teacherName: string
}
