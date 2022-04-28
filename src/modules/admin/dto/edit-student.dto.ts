import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsOptional } from 'class-validator'
import { IsString } from 'src/decorators/validators'

export class EditStudent {
  @ApiProperty()
  @IsOptional()
  @IsString({ notEmpty: true })
  name: string

  @ApiProperty()
  @IsOptional()
  @IsString({ notEmpty: true })
  email: string

  @ApiProperty()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  birthDate: Date

  @ApiProperty()
  @IsOptional()
  @IsString({ notEmpty: true })
  password: string

  @ApiProperty()
  @IsOptional()
  classId: number
}
