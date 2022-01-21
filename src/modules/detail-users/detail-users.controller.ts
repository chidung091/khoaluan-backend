import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common'
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard'
import { MailService } from '../mail/mail.service'
import { CreateUsersDto } from '../users/dto/create-users.dto'
import { DetailUsersService } from './detail-users.service'
import { CreateDetailUsersDto } from './dto/detail-users.dto'

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
    return await this.detailUsersService.findById(req.user.userID)
  }

  @Put('/update')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: CreateDetailUsersDto })
  @ApiOperation({ summary: 'Get users info' })
  @ApiResponse({ status: 201, description: 'Success', type: CreateUsersDto })
  async updateDetailUser(@Req() req, @Body() dto: CreateDetailUsersDto) {
    return await this.detailUsersService.update(req.user.userID, dto)
  }
}
