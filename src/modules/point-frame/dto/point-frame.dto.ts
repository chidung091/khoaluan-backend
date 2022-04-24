import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'src/decorators/validators'

export class CreatePointFrameDto {
  @ApiProperty({ example: 1 })
  @IsString({ notEmpty: false })
  stringPoint: string

  @ApiProperty({ example: 0 })
  @IsNumber({ negative: false })
  minPoint: number

  @ApiProperty({ example: 30 })
  @IsNumber({ negative: false })
  maxPoint: number
}
