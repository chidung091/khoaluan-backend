import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { IsNumber } from 'src/decorators/validators'

export class GetMarkDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber({ notEmpty: true })
  classId: number
}
