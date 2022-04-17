import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
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
import { Role } from '../users/users.enum'
import { UpdateTime } from './dto/update-time.dto'
import { AuthGuard } from '../../guards/auth.guard'
import { RoleGuard } from 'src/guards/role.guard2'
import { Roles } from 'src/decorators/roles.decorator'
import { MessagePattern } from '@nestjs/microservices'

@ApiBearerAuth()
@ApiTags('time')
@Controller('time')
export class TimeController {
  constructor(private readonly timeService: TimeService) {}

  @Post()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Tạo mốc thời gian mới' })
  @ApiBody({ type: CreateTimeDto })
  @ApiResponse({ status: 201, description: 'Success', type: TimeDto })
  async create(@Body() time: CreateTimeDto) {
    return await this.timeService.create(time)
  }

  @Get('/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Tìm mốc thời gian theo id' })
  @ApiResponse({ status: 200, description: 'Success', type: [TimeDto] })
  async findById(@Param('id') id: number) {
    return this.timeService.findById(id)
  }

  @Get()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Tìm mốc thời gian' })
  @ApiResponse({ status: 200, description: 'Success', type: [TimeDto] })
  async get() {
    return this.timeService.get()
  }

  @Get('/active')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Tìm mốc thời gian' })
  @ApiResponse({ status: 200, description: 'Success', type: [TimeDto] })
  async getActiveTime() {
    return this.timeService.findActive()
  }

  @Post('/:id/status')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Đổi trạng thái' })
  @ApiResponse({ status: 200, description: 'Success', type: [TimeDto] })
  async changeStatus(@Param('id') id: number) {
    return this.timeService.changeStatus(id)
  }

  @Put('/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Sửa mốc thời gian cực chuẩn nè' })
  @ApiBody({ type: UpdateTime })
  @ApiResponse({ status: 200, description: 'Success', type: [TimeDto] })
  async update(@Param('id') id: number, @Body() timeUpdate: UpdateTime) {
    return this.timeService.update(id, timeUpdate)
  }

  @Delete('/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Sửa mốc thời gian' })
  @ApiResponse({ status: 200, description: 'Success', type: [TimeDto] })
  async deleteStatus(@Param('id') id: number) {
    return this.timeService.delete(id)
  }

  @MessagePattern({ role: 'time', cmd: 'get-active' })
  async getActive() {
    return this.timeService.findActive()
  }
}
