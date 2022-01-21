import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard'
import RoleGuard from '../auth/guard/role.guard'
import { Role } from '../users/users.enum'
import { ClassService } from './class.service'
import { CreateClassDto } from './dto/create-class.dto'

@ApiBearerAuth()
@ApiTags('class')
@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post()
  @UseGuards(RoleGuard(Role.Department))
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create Class' })
  @ApiOkResponse({ type: CreateClassDto })
  async create(@Body() dto: CreateClassDto) {
    return await this.classService.createClass(dto)
  }
}
