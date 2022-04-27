import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { FileInterceptor } from '@nestjs/platform-express'
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { SERVER_URL } from 'src/config/secrets'
import { Roles } from 'src/decorators/roles.decorator'
import { RoleGuard } from 'src/guards/role.guard'
import { AuthGuard } from '../../guards/auth.guard'
import { CreateUsersDto } from '../users/dto/create-users.dto'
import { Role } from './detail-users.enum'
import { DetailUsersService } from './detail-users.service'
import { DetailUsersMonitorResponseDto } from './dto/detail-users-monitor.response.dto'
import { DetailUsersHeadMasterDto } from './dto/detail-users-search-headmaster.dto'
import { CreateDetailUsersDto } from './dto/detail-users.dto'

@ApiBearerAuth()
@ApiTags('detail-users')
@Controller('detail-users')
export class DetailUsersController {
  constructor(private readonly detailUsersService: DetailUsersService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get users info' })
  @ApiResponse({ status: 201, description: 'Success', type: CreateUsersDto })
  async create(@Req() req) {
    return await this.detailUsersService.findById(req.user.userID)
  }

  @Get('/monitor/list-students')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Monitor)
  @ApiOperation({ summary: 'Get list users by monitor' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: [DetailUsersMonitorResponseDto],
  })
  async listStudents(@Req() req) {
    return await this.detailUsersService.findAllClassByMonitor(req.user.userID)
  }

  @Get('/head-master/list-students/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Teacher)
  @ApiOperation({ summary: 'Get list users by teacher' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: [DetailUsersMonitorResponseDto],
  })
  async listStudentsHeadMaster(@Param('id') classId: number, @Req() req) {
    return await this.detailUsersService.findAllStudentByHeadMaster(
      classId,
      req.user.userID,
    )
  }

  @Get('/head-master/list-students/assign-monitor/:studentId')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Teacher)
  @ApiOperation({ summary: 'Assign new monitor for class' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: [DetailUsersMonitorResponseDto],
  })
  async listStudentsMonitorHeadMaster(
    @Param('studentId') classId: number,
    @Req() req,
  ) {
    return await this.detailUsersService.updateStudentToMonitor(
      classId,
      req.user.userID,
    )
  }

  @Post('/monitor/list-students')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Monitor)
  @ApiOperation({ summary: 'Get list users by monitor' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: [DetailUsersMonitorResponseDto],
  })
  async listStudentsSearch(@Req() req, @Body() dto: DetailUsersHeadMasterDto) {
    return await this.detailUsersService.findStudentIdMonitor(
      dto.studentId,
      req.user.userID,
    )
  }

  @Post('/head-master/list-students')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Teacher)
  @ApiOperation({ summary: 'Get list users by teacher' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: [DetailUsersMonitorResponseDto],
  })
  async listStudentsHeadMasterSearch(
    @Body() dto: DetailUsersHeadMasterDto,
    @Req() req,
  ) {
    return await this.detailUsersService.findStudentIdHeadmaster(
      dto.studentId,
      req.user.userID,
    )
  }

  @Put('/update')
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateDetailUsersDto })
  @ApiOperation({ summary: 'Get users info' })
  @ApiResponse({ status: 201, description: 'Success', type: CreateUsersDto })
  async updateDetailUser(@Req() req, @Body() dto: CreateDetailUsersDto) {
    return await this.detailUsersService.update(req.user.userID, dto)
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
    return await this.detailUsersService.importExcelFile(file)
  }

  @MessagePattern({ role: 'detail-user', cmd: 'get-by-id' })
  async getDetailById(id: number) {
    return this.detailUsersService.findById(id)
  }
}
