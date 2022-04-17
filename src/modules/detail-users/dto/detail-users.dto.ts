import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsOptional } from 'class-validator'
import { IsString } from 'src/decorators/validators'

export class CreateDetailUsersDto {
  @ApiProperty()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  birthDate: Date

  @ApiProperty()
  @IsOptional()
  @IsString({ notEmpty: false })
  imageUrls: string

  @ApiProperty()
  @IsOptional()
  @IsString({ notEmpty: false })
  email: string
}
