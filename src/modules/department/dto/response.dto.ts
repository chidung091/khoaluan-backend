import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class ResponseDepartmentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  departmentId: number

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  departmentName: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  information: string

  @ApiProperty()
  @IsString()
  departmentAdminName: string

  @ApiProperty()
  @IsNumber()
  countStudent: number

  @ApiProperty()
  @IsNumber()
  countClasses: number

  @ApiProperty()
  @IsNumber()
  countTeachers: number
}
