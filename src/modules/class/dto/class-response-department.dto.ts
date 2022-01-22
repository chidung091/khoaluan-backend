import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'src/decorators/validators'

export class ClassResponseDepartmentDto {
  @ApiProperty()
  @IsString({ notEmpty: true })
  courseName: string

  @ApiProperty()
  @IsString({ notEmpty: true })
  className: string

  @ApiProperty()
  @IsNumber({ notEmpty: true })
  count: number

  @ApiProperty()
  @IsString({ notEmpty: true })
  headMasterName: string

  @ApiProperty()
  @IsNumber({ notEmpty: true })
  startYear: number

  @ApiProperty()
  @IsNumber({ notEmpty: true })
  endYear: number
}
