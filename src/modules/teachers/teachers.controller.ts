import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { TeachersService } from './teachers.service'

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @MessagePattern({ role: 'teacher', cmd: 'get-teacher-id' })
  async getDetailById(id: number) {
    return this.teachersService.findById(id)
  }
}
