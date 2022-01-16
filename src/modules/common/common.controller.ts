import { Body, Controller, Post } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CommonService } from './common.service'
import { ConfirmResetPasswordDto } from './dto/confirm-reset-password.dto'
import { CreateResetPasswordDto } from './dto/reset-password.dto'

@ApiTags('common')
@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Post('/create-reset-password')
  @ApiOperation({ summary: 'Tạo yêu cầu đổi pass' })
  @ApiBody({ type: CreateResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Success' })
  async createResetPassword(@Body() dto: CreateResetPasswordDto) {
    return await this.commonService.createResetPassword(dto.email)
  }

  @Post('/reset-password')
  @ApiOperation({ summary: 'Xác thực yêu cầu đổi pass' })
  @ApiBody({ type: ConfirmResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Success' })
  async resetPassword(@Body() dto: ConfirmResetPasswordDto) {
    return await this.commonService.resetPassword(dto.newPassword, dto.token)
  }
}
