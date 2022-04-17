import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { Role } from 'src/modules/users/users.enum'

export class DetailUsersHeadMasterResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  userID: number

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  className: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  studentScore: number

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  monitorScore: number

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  teacherScore: number

  @ApiProperty({ enum: Role })
  role: Role
}
