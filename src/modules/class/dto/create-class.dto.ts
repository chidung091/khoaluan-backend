import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNumber, IsString } from 'src/decorators/validators'

export class CreateClassDto {
  @ApiProperty()
  @IsNumber({ notEmpty: true })
  semester: number

  @ApiProperty()
  @IsNumber({ notEmpty: true })
  startYear: number

  @ApiProperty()
  @IsNumber({ notEmpty: true })
  endYear: number

  @ApiProperty()
  @IsNumber({ notEmpty: true })
  monitorId: number

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
  @IsArray({ notEmpty: true, nestedType: Number })
  studentsIds: [number]

  @ApiProperty()
  @IsNumber({ notEmpty: true })
  headMasterId: number
}
