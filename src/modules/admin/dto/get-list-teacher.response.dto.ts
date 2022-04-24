import { ApiHideProperty, ApiProperty, OmitType } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'
import { IsBoolean } from 'class-validator'
import { IsNumber, IsString } from 'src/decorators/validators'

export class TeacherResponse {
  @ApiProperty()
  @IsNumber({ notEmpty: true })
  teacherId: number

  @ApiProperty()
  @IsNumber({ notEmpty: true })
  userID: number

  @ApiProperty()
  @IsString({ notEmpty: true })
  teacherName: string

  @ApiProperty()
  @IsNumber({ notEmpty: true })
  teacherNumber: number

  @ApiProperty()
  @IsNumber({ notEmpty: true })
  teacherDepartmentId: number

  @ApiProperty()
  @IsBoolean()
  haveClass: boolean
}
export class CreateTeacherResponseDto extends OmitType(TeacherResponse, [
  'haveClass',
  'teacherDepartmentId',
]) {
  @Exclude()
  @ApiHideProperty()
  haveClass: boolean

  @Exclude()
  @ApiHideProperty()
  teacherDepartmentId: number
}
