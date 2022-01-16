import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard'
import { MailService } from '../mail/mail.service'
import { CreateUsersDto } from '../users/dto/create-users.dto'
import { DetailUsersService } from './detail-users.service'

@ApiBearerAuth()
@ApiTags('detail-users')
@Controller('detail-users')
export class DetailUsersController {
  constructor(
    private readonly detailUsersService: DetailUsersService,
    private mailService: MailService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get users info' })
  @ApiResponse({ status: 201, description: 'Success', type: CreateUsersDto })
  async create(@Req() req) {
    return await this.detailUsersService.findById(req.user.id)
  }
}
