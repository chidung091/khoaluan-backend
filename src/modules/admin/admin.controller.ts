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
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { Roles } from 'src/decorators/roles.decorator'
import { RoleGuard } from 'src/guards/role.guard'
import { AuthGuard } from '../../guards/auth.guard'
import { Role } from '../users/users.enum'
import { AdminService } from './admin.service'
import { CreateTeacherDto } from './dto/create-teacher.dto'
import { EditStudent } from './dto/edit-student.dto'
import {
  CreateTeacherResponseDto,
  TeacherResponse,
} from './dto/get-list-teacher.response.dto'
import { getUserByRoleDto } from './dto/get-users-role.dto'

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/users')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Xem danh sách người dùng theo Role' })
  @ApiBody({ type: getUserByRoleDto })
  @ApiResponse({ status: 200, description: 'Success' })
  async logIn(dto: getUserByRoleDto) {
    return await this.adminService.getUserByRole(dto.role)
  }

  @Get('/list-teacher')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Xem danh sách giáo viên chủ nhiệm' })
  @ApiResponse({ status: 200, description: 'Success', type: [TeacherResponse] })
  async getTeacher() {
    return this.adminService.getListTeacher()
  }

  @Get('/list-student')
  @ApiOperation({ summary: 'Xem danh sách sinh viên' })
  @ApiResponse({ status: 200, description: 'Success', type: [TeacherResponse] })
  async getStudent() {
    return this.adminService.getListStudent()
  }

  @Post('/create-teacher')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Xem danh sách giáo viên chủ nhiệm' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: CreateTeacherResponseDto,
  })
  async createTeacher(@Body() dto: CreateTeacherDto) {
    return this.adminService.createTeacher(dto)
  }

  @Post('/update-student/:studentId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Cập nhật thông tin học sinh' })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async updateStudent(
    @Param('studentId') studentId: number,
    @Body() dto: EditStudent,
  ) {
    return this.adminService.editStudent(studentId, dto)
  }

  @Post('/assign-department-teacher/:departmentId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Gán giáo viên vào khoa' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: CreateTeacherResponseDto,
  })
  async assignTeacher(@Req() req, @Param('departmentId') departmentId: number) {
    return this.adminService.assignDepartmentTeacher(
      req.user.userID,
      departmentId,
    )
  }
}
