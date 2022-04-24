import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common'
import { ClassService } from '../class/class.service'
import { DepartmentService } from '../department/department.service'
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
  ) {}

  public async getUserByRole(role: Role) {
    return this.usersService.getListByRole(role)
  }

  public async getListStudent() {
    const dataStudent = await this.usersService.getListByRole(Role.Student)
    const dataMonitor = await this.usersService.getListByRole(Role.Monitor)
    console.log(dataStudent)
    return dataStudent
  }
  public async getListTeacher() {
    const dataTeacher = await this.usersService.getListByRole(Role.Teacher)
    console.log(dataTeacher)
    const dataResponse = []
    await Promise.all(
      dataTeacher.map(async (singleTeacher) => {
        const dataClass = await this.classService.findAllClassByHeadMaster(
          singleTeacher.userID,
        )
        const dataTeachers = await this.teacherService.findById(
          singleTeacher.userID,
        )
        console.log(dataTeachers)
        let haveClass = false
        if (dataClass) {
          haveClass = true
        }
        const dataObject = {
          teacherId: dataTeachers.teacherId,
          userID: singleTeacher.userID,
          teacherName: dataTeachers.teacherName,
          teacherNumber: dataTeachers.teacherNumber,
          teacherDepartmentId: dataTeachers.teacherDepartmentDepartmentId,
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
