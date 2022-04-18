import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { Roles } from 'src/decorators/roles.decorator'
import { RoleGuard } from 'src/guards/role.guard2'
import { AuthGuard } from '../../guards/auth.guard'
import { Role } from '../users/users.enum'
import { AdminService } from './admin.service'
import { CreateTeacherDto } from './dto/create-teacher.dto'
import {
  CreateTeacherResponseDto,
  TeacherResponse,
} from './dto/get-list-teacher.response.dto'
import { getUserByRoleDto } from './dto/get-users-role.dto'

@ApiBearerAuth()
@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/users')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Xem danh sách người dùng theo Role' })
  @ApiBody({ type: getUserByRoleDto })
  @ApiResponse({ status: 200, description: 'Success' })
  async logIn(dto: getUserByRoleDto) {
    return await this.adminService.getUserByRole(dto.role)
  }

  @Get('/list-teacher')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Xem danh sách giáo viên chủ nhiệm' })
  @ApiResponse({ status: 200, description: 'Success', type: [TeacherResponse] })
  async getTeacher() {
    return this.adminService.getListTeacher()
  }

  @Post('/create-teacher')
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
}
