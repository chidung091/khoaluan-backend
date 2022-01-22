import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { CLASS_BY_DEPARTMENT } from 'src/config/constants'
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard'
import RoleGuard from '../auth/guard/role.guard'
import { Role } from '../users/users.enum'
import { ClassService } from './class.service'
import { ClassResponseDepartmentDto } from './dto/class-response-department.dto'
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

  @Get()
  @UseGuards(RoleGuard(Role.Department))
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: CLASS_BY_DEPARTMENT })
  @ApiOkResponse({ type: ClassResponseDepartmentDto })
  async get(@Req() req) {
    return await this.classService.findAllClassByDepartmemt(req.user.userID)
  }

  @Get('/monitor')
  @UseGuards(RoleGuard(Role.Monitor))
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: CLASS_BY_DEPARTMENT })
  @ApiOkResponse({ type: ClassResponseDepartmentDto })
  async getMonitor(@Req() req) {
    return await this.classService.findAllClassByMonitor(req.user.userID)
  }

  @Get('/head-master')
  @UseGuards(RoleGuard(Role.Teacher))
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: CLASS_BY_DEPARTMENT })
  @ApiOkResponse({ type: ClassResponseDepartmentDto })
  async getHeadMaster(@Req() req) {
    return await this.classService.findAllClassByHeadMaster(req.user.userID)
  }

  @Get('/:id')
  @UseGuards(RoleGuard(Role.Department))
  @UseGuards(JwtAuthGuard)
  async getDetail(@Param('id') id: number) {
    return await this.classService.findDetailClass(id)
  }
}
