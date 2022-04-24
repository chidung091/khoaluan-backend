import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { IsArray, IsNumber, IsString } from 'src/decorators/validators'

export class CreateClassDto {
  @ApiProperty()
  @IsNumber({ notEmpty: true })
  monitorId: number

  @ApiProperty()
  @IsOptional()
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
