import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsEnum } from 'src/decorators/validators'
import { Status } from '../time.enum'

export class UpdateTimeDto {
  @ApiProperty()
  startYear: number

  @ApiProperty()
  endYear: number

  @ApiProperty()
  semester: number

  @ApiProperty()
  @Type(() => Date)
  startTimeStudent: Date

  @ApiProperty()
  @Type(() => Date)
  endTimeStudent: Date

  @ApiProperty()
  @Type(() => Date)
  startTimeMonitor: Date

  @ApiProperty()
  @Type(() => Date)
  endTimeMonitor: Date

  @ApiProperty()
  @Type(() => Date)
  startTimeHeadMaster: Date

  @ApiProperty()
  @Type(() => Date)
  endTimeHeadMaster: Date

  @ApiProperty()
  @Type(() => Date)
  startTimeDepartment: Date

  @ApiProperty()
  @Type(() => Date)
  endTimeDepartment: Date

  @ApiProperty()
  @IsEnum({ entity: Status })
  status: Status
}
