import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsNumber } from 'class-validator'

export class CreateTimeDto {
  @ApiProperty()
  @IsNumber()
  id: number

  @ApiProperty()
  @IsNumber()
  startYear: number

  @ApiProperty()
  @IsNumber()
  endYear: number

  @ApiProperty()
  @IsNumber()
  semester: number

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  startTimeStudent: Date

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  endTimeStudent: Date

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  startTimeMonitor: Date

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  endTimeMonitor: Date

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  startTimeHeadMaster: Date

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  endTimeHeadMaster: Date

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  startTimeDepartment: Date

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  endTimeDepartment: Date
}
