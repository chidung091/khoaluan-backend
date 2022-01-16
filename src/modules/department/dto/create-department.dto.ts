import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import { IsNumber } from 'src/decorators/validators'

export class CreateDepartmentDto {
  @ApiProperty()
  @IsNumber({ integer: true, notEmpty: true })
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
  @IsNumber({ integer: true, notEmpty: true })
  departmentAdminUserID: number
}
