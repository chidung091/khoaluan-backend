import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'src/decorators/validators'

export class ClassResponseHeadMasterDto {
  @ApiProperty()
  @IsString({ notEmpty: true })
  className: string

  @ApiProperty()
  @IsNumber({ notEmpty: true })
  classId: number
}
