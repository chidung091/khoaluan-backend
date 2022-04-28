import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags } from '@nestjs/swagger'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { TeachersService } from './teachers.service'

@ApiTags('teachers')
@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @MessagePattern({ role: 'teacher', cmd: 'get-teacher-id' })
  async getDetailById(id: number) {
    return this.teachersService.findById(id)
  }

  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './excels',
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
  async uploadAvatar(@UploadedFile() file) {
    return await this.teachersService.importExcelFile(file)
  }
}
