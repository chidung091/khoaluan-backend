import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { Roles } from 'src/decorators/roles.decorator'
import { AuthGuard } from 'src/guards/auth.guard'
import { RoleGuard } from 'src/guards/role.guard2'
import { Role } from '../users/users.enum'
import { DepartmentService } from './department.service'
import { CreateDepartmentDto } from './dto/create-department.dto'
import { ResponseDepartmentDto } from './dto/response.dto'

@ApiTags('department')
@ApiBearerAuth()
@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all department' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: [ResponseDepartmentDto],
  })
  async find() {
    return await this.departmentService.findAll()
  }

  @Get('/list-teachers')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Department)
  async findListTeacher(@Req() req) {
    return await this.departmentService.findListTeachers(req.user.userID)
  }

  @Post()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Create new department' })
  @ApiResponse({
    status: 201,
    description: 'Success',
    type: ResponseDepartmentDto,
  })
  async create(@Body() dto: CreateDepartmentDto) {
    return await this.departmentService.create(dto)
  }
}
