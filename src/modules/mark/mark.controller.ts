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

  @Post('/get-mark')
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

  @Post('/get-detail-mark')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Student, Role.Monitor, Role.Teacher)
  @ApiOperation({ summary: 'Lấy danh sách điểm chi tiết của sinh viên' })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async getDetailMarkPages(@Req() req, @Body() dto: GetMarkDto) {
    if (req.user.role === Role.Teacher) {
      return await this.markService.getDetailMarkPages(
        dto.studentId,
        req.user.role,
        dto.classId,
      )
    }
    if (req.user.role === Role.Monitor) {
      return await this.markService.getDetailMarkPages(
        dto.studentId,
        req.user.role,
        dto.classId,
      )
    }
    return await this.markService.getDetailMarkPages(
      req.user.userID,
      req.user.role,
      dto.classId,
    )
  }

  @Get('/get-mark/:markId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Department)
  @ApiOperation({ summary: 'Lấy chi tiết danh sách điểm của lớp theo mã điểm' })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async getMarkDetail(@Req() req, @Param('markId') markId: number) {
    return await this.markService.getDetailMark(markId)
  }

  @Get('/approved-mark/:markId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Department)
  @ApiOperation({ summary: 'Phê duyệt danh sách điểm của lớp theo mã điểm' })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async approvedMarkDetail(@Req() req, @Param('markId') markId: number) {
    return await this.markService.approveMark(markId)
  }

  @Get('/list-class-department')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Department)
  @ApiOperation({ summary: 'Lấy danh sách điểm của lớp của sinh viên' })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async getMarkDepartment(@Req() req) {
    return await this.markService.getListMarkDepartment(req.user.userID)
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
