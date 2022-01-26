import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { BaseDto } from 'src/common/dto'

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
  @IsNotEmpty()
  @IsNumber()
  departmentAdminUserId: number

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
