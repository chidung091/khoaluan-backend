import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNumber, IsString } from 'src/decorators/validators'

export class CreateClassDto {
  @ApiProperty()
  @IsNumber({ notEmpty: true })
  classId: number

  @ApiProperty()
  @IsString({ notEmpty: true })
  className: string

  @ApiProperty()
  @IsNumber({ notEmpty: true })
  classDepartmentDepartmentId: number

  @ApiProperty()
  @IsNumber({ notEmpty: true })
  classCourseCourseId: number

  @ApiProperty()
  @IsArray({ notEmpty: true })
  studentsIds: [number]

  @ApiProperty()
  @IsNumber({ notEmpty: true })
  headMasterId: number
}
