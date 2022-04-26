import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
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
import { CreateMarkDto } from './dto/create-mark-dto'
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
  @ApiOperation({ summary: 'Get list users by monitor' })
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
  @ApiOperation({ summary: 'Get list users by monitor' })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async createMarkStudent(@Req() req, @Body() dto: CreateMarkDto) {
    return await this.markService.createMarkStudent(req.user.userID, dto)
  }
}
