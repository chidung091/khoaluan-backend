import { Controller, Post, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard'
import RoleGuard from '../auth/guard/role.guard'
import { Role } from '../users/users.enum'
import { AdminService } from './admin.service'
import { getUserByRoleDto } from './dto/get-users-role.dto'

@ApiBearerAuth()
@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/users')
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Xem danh sách người dùng theo Role' })
  @ApiBody({ type: getUserByRoleDto })
  @ApiResponse({ status: 200, description: 'Success' })
  async logIn(dto: getUserByRoleDto) {
    return await this.adminService.getUserByRole(dto.role)
  }
}
