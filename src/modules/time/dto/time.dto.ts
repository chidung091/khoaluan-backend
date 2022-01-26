import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate } from 'class-validator'
import { IsEnum, IsNumber } from 'src/decorators/validators'
import { Status } from '../time.enum'

export class TimeDto {
  @ApiProperty()
  @IsNumber({ notEmpty: true })
  id: number

  @ApiProperty()
  @IsNumber({ notEmpty: true })
  startYear: number

  @ApiProperty()
  @IsNumber({ notEmpty: true })
  endYear: number

  @ApiProperty()
  @IsNumber({ notEmpty: true })
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
