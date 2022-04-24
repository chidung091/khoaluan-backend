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
import { ApiBearerAuth, ApiOperation, ApiBody, ApiTags } from '@nestjs/swagger'
import { Roles } from 'src/decorators/roles.decorator'
import { AuthGuard } from 'src/guards/auth.guard'
import { RoleGuard } from 'src/guards/role.guard'
import { Role } from '../users/users.enum'
import { CreatePointFrameDto } from './dto/point-frame.dto'
import { PointFrameService } from './point-frame.service'

@ApiTags('point-frame')
@Controller('point-frame')
export class PointFrameController {
  constructor(private readonly pointFrameService: PointFrameService) {}

  @Post('')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Tạo mốc thời gian mới' })
  @ApiBody({ type: CreatePointFrameDto })
  async create(@Body() time: CreatePointFrameDto) {
    return await this.pointFrameService.create(time)
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Tìm mốc thời gian theo id' })
  async findById(@Param('id') id: number) {
    return this.pointFrameService.findById(id)
  }

  @Get('')
  @ApiOperation({ summary: 'Tìm mốc thời gian' })
  async get() {
    return this.pointFrameService.get()
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Sửa mốc thời gian cực chuẩn nè' })
  @ApiBody({ type: CreatePointFrameDto })
  async update(
    @Param('id') id: number,
    @Body() timeUpdate: CreatePointFrameDto,
  ) {
    return this.pointFrameService.update(id, timeUpdate)
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Sửa mốc thời gian' })
  async deleteStatus(@Param('id') id: number) {
    return this.pointFrameService.delete(id)
  }
}
