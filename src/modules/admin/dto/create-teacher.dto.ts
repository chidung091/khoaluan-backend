import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'src/decorators/validators'

export class CreateTeacherDto {
  @ApiProperty()
  @IsString({ notEmpty: true })
  userID: number

  @ApiProperty()
  @IsString({ notEmpty: true })
  teacherName: string

  @ApiProperty()
  @IsString({ notEmpty: true })
  teacherNumber: number

  @ApiProperty()
  @IsString({ notEmpty: true })
  email: string

  @ApiProperty()
  @IsString({ notEmpty: true })
  password: string
}
