import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { SERVER_URL } from 'src/config/secrets'
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

  @Post('/avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './avatars',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('')
          return cb(null, `${randomName}${extname(file.originalname)}`)
        },
      }),
    }),
  )
  uploadAvatar(@UploadedFile() file) {
    return `${SERVER_URL}${file.path}`
  }

  @Get('avatars/:fileId')
  async serveAvatar(@Param('fileId') fileId, @Res() res): Promise<any> {
    res.sendFile(fileId, { root: 'avatars' })
  }
}
