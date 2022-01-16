import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { TimeService } from './time.service'
import { CreateTimeDto } from './dto/create-time.dto'
import { TimeDto } from './dto/time.dto'

@ApiBearerAuth()
@ApiTags('time')
@Controller('time')
export class TimeController {
  constructor(private readonly timeService: TimeService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo mốc thời gian mới' })
  @ApiBody({ type: CreateTimeDto })
  @ApiResponse({ status: 201, description: 'Success', type: TimeDto })
  async create(@Body() time: CreateTimeDto) {
    return await this.timeService.create(time)
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Tìm mốc thời gian theo id' })
  @ApiResponse({ status: 200, description: 'Success', type: [TimeDto] })
  async findById(@Param('id') id: number) {
    return this.timeService.findById(id)
  }

  @Get()
  @ApiOperation({ summary: 'Tìm mốc thời gian' })
  @ApiResponse({ status: 200, description: 'Success', type: [TimeDto] })
  async get() {
    return this.timeService.get()
  }
  @Put('/:id')
  @ApiOperation({ summary: 'Sửa mốc thời gian' })
  @ApiResponse({ status: 200, description: 'Success', type: [TimeDto] })
  async update(@Param('id') id: number, @Body() time: TimeDto) {
    return this.timeService.update(id, time)
  }
}
