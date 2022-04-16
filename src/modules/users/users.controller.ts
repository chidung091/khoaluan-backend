import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import {
  ApiBearerAuth,
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { Roles } from 'src/decorators/roles.decorator'
import { RoleGuard } from 'src/guards/role.guard2'
import { AuthGuard } from '../../guards/auth.guard'
import { ChangePasswordDto } from './dto/change-password.dto'
import { CreateUsersDto } from './dto/create-users.dto'
import { Users } from './entity/users.entity'
import { Role } from './users.enum'
import { UsersService } from './users.service'

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Tạo tài khoản sinh viên mới' })
  @ApiBody({ type: CreateUsersDto })
  @ApiResponse({ status: 201, description: 'Success', type: CreateUsersDto })
  async create(@Body() dto: CreateUsersDto) {
    return await this.usersService.createUser(dto)
  }

  @Post('/change-password')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Đổi pass tài khoản' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ status: 201, description: 'Success', type: CreateUsersDto })
  async changePassword(@Req() req, @Body() dto: ChangePasswordDto) {
    return await this.usersService.changePassword(
      req.user.userID,
      dto.oldPassword,
      dto.newPassword,
    )
  }

  @Get('/checkuid')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Student, Role.Department)
  @ApiOperation({ summary: 'Đổi pass tài khoản' })
  async checkUID(@Req() req) {
    return req.user.userID
  }

  @Get('/test')
  @ApiOperation({ summary: 'Test' })
  async testApi() {
    return 'true'
  }

  @MessagePattern({ role: 'user', cmd: 'get-by-id' })
  async getUserById(id: number): Promise<Users> {
    return this.usersService.getByIdForMicroservice(id)
  }
  @MessagePattern({ role: 'user', cmd: 'get-by-email' })
  async getUserByEmail(email: string) {
    return await this.usersService.getByEmailForMicroservice(email)
  }
}
