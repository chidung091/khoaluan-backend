import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common'
import { ClassService } from '../class/class.service'
import { DepartmentService } from '../department/department.service'
import { DetailUsersService } from '../detail-users/detail-users.service'
import { CreateTableTeacherDto } from '../teachers/dto/create-teacher.dto'
import { TeachersService } from '../teachers/teachers.service'
import { CreateUsersDto } from '../users/dto/create-users.dto'
import { Role } from '../users/users.enum'
import { UsersService } from '../users/users.service'
import { CreateTeacherDto } from './dto/create-teacher.dto'

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,
    private readonly classService: ClassService,
    private readonly teacherService: TeachersService,
    @Inject(forwardRef(() => DepartmentService))
    private departmentService: DepartmentService,
    @Inject(forwardRef(() => DetailUsersService))
    private detailUsersService: DetailUsersService,
  ) {}

  public async getUserByRole(role: Role) {
    return this.usersService.getListByRole(role)
  }

  public async getListStudent() {
    const dataStudent = await this.usersService.getListByRole(Role.Student)
    const dataMonitor = await this.usersService.getListByRole(Role.Monitor)
    const dataQuery = []
    const dataResponse = []
    await Promise.all(
      dataStudent.map(async (singleStudent) => {
        dataQuery.push(singleStudent)
      }),
    )
    await Promise.all(
      dataMonitor.map(async (singleStudent) => {
        dataQuery.push(singleStudent)
      }),
    )
    await Promise.all(
      dataQuery.map(async (single) => {
        const dataRes = {
          userID: single.userID,
          name: (await this.detailUsersService.findById(single.userID)).name,
          email: single.email,
          role: single.role,
          createdAt: single.createdAt,
          updatedAt: single.updatedAt,
        }
        dataResponse.push(dataRes)
      }),
    )
    return dataResponse
  }
  public async getListTeacher() {
    const dataTeacher = await this.usersService.getListByRole(Role.Teacher)
    const dataResponse = []
    await Promise.all(
      dataTeacher.map(async (singleTeacher) => {
        const dataClass = await this.classService.findAllClassByHeadMaster(
          singleTeacher.userID,
        )
        const dataTeachers = await this.teacherService.findById(
          singleTeacher.userID,
        )
        let haveClass = false
        if (dataClass.length > 0) {
          haveClass = true
        }
        const data = await this.departmentService.findDepartmentName(
          dataTeachers.teacherDepartmentDepartmentId,
        )
        const dataObject = {
          teacherId: dataTeachers.teacherId,
          userID: singleTeacher.userID,
          teacherName: dataTeachers.teacherName,
          teacherNumber: dataTeachers.teacherNumber,
          teacherDepartmentName: data.departmentName,
          haveClass: haveClass,
          class: dataClass,
        }
        dataResponse.push(dataObject)
      }),
    )
    return dataResponse
  }

  public async createTeacher(dto: CreateTeacherDto) {
    const createUserTeacher: CreateUsersDto = {
      userID: dto.userID,
      email: dto.email,
      password: dto.password,
    }
    const createUser = await this.usersService.createTeacher(createUserTeacher)
    if (!createUser) {
      throw new BadRequestException('Bad Request')
    }
    const createTeacherDto: CreateTableTeacherDto = {
      teacherName: dto.teacherName,
      teacherNumber: dto.teacherNumber,
    }
    const createTeacher = await this.teacherService.createTeacher(
      createTeacherDto,
      createUser.userID,
    )
    if (!createTeacher) {
      throw new BadRequestException('Bad Request')
    }
    const dataObject = {
      teacherId: createTeacher.teacherId,
      userID: createUser.userID,
      teacherName: createTeacher.teacherName,
      teacherNumber: createTeacher.teacherNumber,
    }
    return dataObject
  }

  public async assignDepartmentTeacher(userID: number, departmentId: number) {
    return this.teacherService.assignDepartment(userID, departmentId)
  }
}
