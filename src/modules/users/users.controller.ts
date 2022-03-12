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
import { AuthGuard } from '../auth/guard/auth.guard'
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard'
import RoleGuard from '../auth/guard/role.guard'
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
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Tạo tài khoản sinh viên mới' })
  @ApiBody({ type: CreateUsersDto })
  @ApiResponse({ status: 201, description: 'Success', type: CreateUsersDto })
  async create(@Body() dto: CreateUsersDto) {
    return await this.usersService.createUser(dto)
  }

  @Post('/change-password')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Đổi pass tài khoản' })
  async checkUID(@Req() req) {
    return req.user.userID
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
