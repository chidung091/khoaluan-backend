import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsNumber, IsString } from 'src/decorators/validators'

export class UpdateMarkDetail {
  @ApiProperty()
  @IsString({ notEmpty: true })
  pointId: string

  @ApiProperty()
  @IsNumber({ notEmpty: true })
  studentScore: number
}
export class CreateMarkDto {
  @ApiPropertyOptional({
    type: [UpdateMarkDetail],
    description: 'UpdateMarkDetail',
  })
  @IsArray({
    nestedType: UpdateMarkDetail,
    nestedValidate: true,
    notEmpty: true,
    unique: [(o: UpdateMarkDetail) => o.pointId],
    minSize: 1,
  })
  markDetail: UpdateMarkDetail[]
}
