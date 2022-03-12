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
import { Roles } from 'src/decorators/roles.decorator'
import { RoleGuard } from 'src/guards/role.guard2'
import { AuthGuard } from '../auth/guard/auth.guard'
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard'
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
  @ApiOperation({ summary: 'Create Class' })
  @ApiOkResponse({ type: CreateClassDto })
  async create(@Body() dto: CreateClassDto) {
    return await this.classService.createClassTCP(dto)
  }

  @Get()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Department)
  @ApiOperation({ summary: CLASS_BY_DEPARTMENT })
  @ApiOkResponse({ type: ClassResponseDepartmentDto })
  async get(@Req() req) {
    return await this.classService.findAllClassByDepartmemt(req.user.userID)
  }

  @Get('/monitor')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Monitor)
  @ApiOperation({ summary: CLASS_BY_DEPARTMENT })
  @ApiOkResponse({ type: ClassResponseDepartmentDto })
  async getMonitor(@Req() req) {
    return await this.classService.findAllClassByMonitor(req.user.userID)
  }

  @Get('/head-master')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Teacher)
  @ApiOperation({ summary: CLASS_BY_DEPARTMENT })
  @ApiOkResponse({ type: ClassResponseDepartmentDto })
  async getHeadMaster(@Req() req) {
    return await this.classService.findAllClassByHeadMaster(req.user.userID)
  }

  @Get('/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Department)
  async getDetail(@Param('id') id: number) {
    return await this.classService.findDetailClass(id)
  }
}
