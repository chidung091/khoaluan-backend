import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard'
import { DepartmentService } from './department.service'
import { CreateDepartmentDto } from './dto/create-department.dto'
import { ResponseDepartmentDto } from './dto/response.dto'

@ApiTags('department')
@ApiBearerAuth()
@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all department' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: [ResponseDepartmentDto],
  })
  async find() {
    return await this.departmentService.findAll()
  }

  @Post()
  @UseGuards(JwtAuthGuard)
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
