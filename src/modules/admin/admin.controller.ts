import { Controller, Post, UseGuards } from '@nestjs/common'
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
}
