import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
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
import { MarkService } from './mark.service'

@ApiTags('mark')
@Controller('mark')
export class MarkController {
  constructor(private readonly markService: MarkService) {}

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
