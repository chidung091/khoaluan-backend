import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common'
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard'
import RoleGuard from '../auth/guard/role.guard'
import { CreateUsersDto } from '../users/dto/create-users.dto'
import { Role } from './detail-users.enum'
import { DetailUsersService } from './detail-users.service'
import { DetailUsersMonitorResponseDto } from './dto/detail-users-monitor.response.dto'
import { CreateDetailUsersDto } from './dto/detail-users.dto'

@ApiBearerAuth()
@ApiTags('detail-users')
@Controller('detail-users')
export class DetailUsersController {
  constructor(private readonly detailUsersService: DetailUsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get users info' })
  @ApiResponse({ status: 201, description: 'Success', type: CreateUsersDto })
  async create(@Req() req) {
    return await this.detailUsersService.findById(req.user.userID)
  }

  @Get('/monitor/list-students')
  @UseGuards(RoleGuard(Role.Monitor))
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get list users by monitor' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: [DetailUsersMonitorResponseDto],
  })
  async listStudents(@Req() req) {
    return await this.detailUsersService.findAllClassByMonitor(req.user.userID)
  }

  @Get('/head-master/list-students/:id')
  @UseGuards(RoleGuard(Role.Teacher))
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get list users by teacher' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: [DetailUsersMonitorResponseDto],
  })
  async listStudentsHeadMaster(@Param('id') classId: number, @Req() req) {
    return await this.detailUsersService.findAllStudentByHeadMaster(
      classId,
      req.user.userID,
    )
  }

  @Put('/update')
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(Role.Monitor))
  @ApiBody({ type: CreateDetailUsersDto })
  @ApiOperation({ summary: 'Get users info' })
  @ApiResponse({ status: 201, description: 'Success', type: CreateUsersDto })
  async updateDetailUser(@Req() req, @Body() dto: CreateDetailUsersDto) {
    return await this.detailUsersService.update(req.user.userID, dto)
  }
}
