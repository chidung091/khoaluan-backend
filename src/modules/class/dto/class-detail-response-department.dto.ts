import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'src/decorators/validators'

export class ClassDetailResponseDepartmentDto {
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

  @ApiProperty()
  @IsNumber({ notEmpty: true })
  semester: number
}
