import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate } from 'class-validator'
import { IsEnum, IsNumber } from 'src/decorators/validators'
import { Status } from '../time.enum'

export class UpdateTimeDto {
  @ApiProperty()
  @IsNumber({ notEmpty: false })
  startYear: number

  @ApiProperty()
  @IsNumber({ notEmpty: false })
  endYear: number

  @ApiProperty()
  @IsNumber({ notEmpty: false })
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

  @ApiProperty()
  @IsEnum({ entity: Status })
  status: Status
}
