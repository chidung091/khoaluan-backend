import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { Roles } from 'src/decorators/roles.decorator'
import { AuthGuard } from 'src/guards/auth.guard'
import { RoleGuard } from 'src/guards/role.guard'
import { Role } from '../users/users.enum'
import { CreateMarkDto, CreateMarkMonitorDto } from './dto/create-mark-dto'
import { GetMarkDto } from './dto/get-mark.dto'
import { MarkService } from './mark.service'

@ApiTags('mark')
@Controller('mark')
export class MarkController {
  constructor(private readonly markService: MarkService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Student, Role.Monitor, Role.Teacher)
  @ApiOperation({ summary: 'Lấy danh sách điểm của lớp của sinh viên' })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async getMark(@Req() req, @Body() dto: GetMarkDto) {
    return await this.markService.getMark(
      req.user.userID,
      req.user.role,
      dto.classId,
    )
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Student, Role.Monitor)
  @ApiOperation({
    summary: 'Chấm điểm cho cá nhân thành viên hoặc bản thân lớp trưởng',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async createMarkStudent(@Req() req, @Body() dto: CreateMarkDto) {
    return await this.markService.createMarkStudent(req.user.userID, dto)
  }

  @Post('/monitor/:studentId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Student, Role.Monitor)
  @ApiOperation({
    summary: 'Chấm điểm cho cá nhân thành viên hoặc bản thân lớp trưởng',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async createMarkMonitor(
    @Req() req,
    @Param('studentId') studentId: number,
    @Body() dto: CreateMarkMonitorDto,
  ) {
    return await this.markService.createMarkMonitor(
      req.user.userID,
      studentId,
      dto,
    )
  }
}
