import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate } from 'class-validator'

export class CreateDetailUsersDto {
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  birthDate: Date
}
