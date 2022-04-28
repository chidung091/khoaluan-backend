import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'src/decorators/validators'

export class DetailUsersParamsDto {
  @IsNumber({ notEmpty: true })
  @ApiProperty({
    type: Number,
    description: 'studentId',
    example: 1,
  })
  studentId: number

  @IsNumber({ notEmpty: true })
  @ApiProperty({
    type: Number,
    description: 'classId',
    example: 1,
  })
  classId: number
}
