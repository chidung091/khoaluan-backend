import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { firstValueFrom } from 'rxjs'
import { HttpService } from '@nestjs/axios'
import { Repository } from 'typeorm'
import { CreateClassDto } from './dto/create-class.dto'
import { Class } from './entity/class.entity'
import {
  IClassId,
  IClassIds,
  IClassResponse,
  ICreateClassWebhook,
  IDepartmentResponse,
  IMonitor,
  IMonitorId,
  IStudents,
  ITeacher,
} from './interface/create-class-webhook.interface'
import { DepartmentService } from '../department/department.service'
import { ClassResponseDepartmentDto } from './dto/class-response-department.dto'
import { CourseService } from '../course/course.service'
import { TeachersService } from '../teachers/teachers.service'
import { ClassDetailResponseDepartmentDto } from './dto/class-detail-response-department.dto'
import { ClassResponseHeadMasterDto } from './dto/class-response-headmaster.dto'
import { ClientProxy } from '@nestjs/microservices'
import { TimeService } from '../time/time.service'

@Injectable()
export class ClassService {
  constructor(
    @Inject('RATING_SERVICE')
    private readonly client: ClientProxy,
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    private httpService: HttpService,
    private departmentService: DepartmentService,
    private courseService: CourseService,
    private teachersService: TeachersService,
    private timeService: TimeService,
  ) {}

  private async findById(id: number): Promise<Class[]> {
    return this.classRepository
      .createQueryBuilder('class')
      .leftJoinAndSelect('class.classDepartment', 'departmentId')
      .where('class.classDepartmentDepartmentId = :id', { id: id })
      .getMany()
  }

  public async findName(id: number) {
    const data = await this.classRepository.findOne(id)
    if (!data) {
      throw new NotFoundException('NOT_FOUND_CLASS')
    }
    return data.className
  }

  public async createClass(dto: CreateClassDto) {
    const studentWh: IStudents = {
      semester: dto.semester,
      studentsIds: dto.studentsIds,
      startYear: dto.startYear,
      endYear: dto.endYear,
      headMasterId: dto.headMasterId,
      monitorId: dto.monitorId,
    }
    const classWh: ICreateClassWebhook = {
      classId: dto.classId,
      courseId: dto.classCourseCourseId,
      students: [studentWh],
    }
    const user = this.client.emit<ICreateClassWebhook>(
      { role: 'class', cmd: 'create' },
      classWh,
    )
    await this.classRepository.save(dto)
    return user
  }

  public async findAllClassByDepartmemt(id: number) {
    const getActiveTime = await this.timeService.findActive()

    const department = await this.departmentService.findDepartment(id)
    const data = await this.findById(department.departmentId)
    const classIdsWh = []
    data.forEach(function (arrayItem) {
      classIdsWh.push(arrayItem.classId)
    })
    if (classIdsWh.length > 0) {
      const classIdWh: IClassIds = {
        classIds: classIdsWh,
      }
      const classWh = await firstValueFrom<IClassResponse[]>(
        this.client.send({ role: 'class', cmd: 'get-class' }, classIdWh),
      )
      const classReponse: IClassResponse[] = classWh
      const classReponsee: ClassResponseDepartmentDto[] = []
      await Promise.all(
        classReponse.map(async (arrayItem) => {
          const students: IStudents[] = arrayItem.students
          const student = students.find((student) => {
            return (
              student.startYear === getActiveTime.startYear &&
              student.endYear === getActiveTime.endYear
            )
          })
          const data: ClassResponseDepartmentDto = {
            courseName: (await this.courseService.findName(arrayItem.courseId))
              .courseName,
            classId: arrayItem.classId,
            className: await this.findName(arrayItem.classId),
            count: student.studentsIds.length,
            headMasterName: await this.teachersService.findName(
              student.headMasterId,
            ),
            startYear: (await this.courseService.findName(arrayItem.courseId))
              .courseStartTime,
            endYear: (await this.courseService.findName(arrayItem.courseId))
              .courseEndTime,
          }
          classReponsee.push(data)
        }),
      )
      return classReponsee
    }
    return new NotFoundException('Error')
  }

  public async findDetailClass(id: number) {
    const data = await this.classRepository.findOne(id)
    if (!data) {
      throw new NotFoundException('NOT_FOUND_CLASS')
    }
    const classIdWh: IClassId = {
      classId: id,
    }
    const classWh = await firstValueFrom<IClassResponse>(
      this.client.send({ role: 'class', cmd: 'class-detail' }, classIdWh),
    )
    const students = classWh.students
    const classReponse: ClassDetailResponseDepartmentDto[] = []
    await Promise.all(
      students.map(async (arrayItem) => {
        const response: ClassDetailResponseDepartmentDto = {
          count: arrayItem.studentsIds.length,
          headMasterName: await this.teachersService.findName(
            arrayItem.headMasterId,
          ),
          startYear: arrayItem.startYear,
          endYear: arrayItem.endYear,
          semester: arrayItem.semester,
        }
        classReponse.push(response)
      }),
    )
    return classReponse
  }

  public async findAllClassByMonitor(id: number) {
    const getActiveTime = await this.timeService.findActive()

    const classIdWh: IMonitor = {
      monitorId: id,
      startYear: getActiveTime.startYear,
      endYear: getActiveTime.endYear,
      semester: getActiveTime.semester,
    }
    const classWh = await firstValueFrom<IClassResponse[]>(
      this.client.send({ role: 'class', cmd: 'get-class-monitor' }, classIdWh),
    )
    return classWh
  }

  public async findAllClassByHeadMaster(id: number) {
    const getActiveTime = await this.timeService.findActive()

    const classIdWh: ITeacher = {
      headMasterId: id,
      startYear: getActiveTime.startYear,
      endYear: getActiveTime.endYear,
      semester: getActiveTime.semester,
    }
    const classWh = await firstValueFrom<[number]>(
      this.client.send({ role: 'class', cmd: 'get-class' }, classIdWh),
    )
    const dataResponse: ClassResponseHeadMasterDto[] = []
    await Promise.all(
      classWh.map(async (arrayItem) => {
        const dataRes: ClassResponseHeadMasterDto = {
          className: await this.findName(arrayItem),
          classId: arrayItem,
        }
        dataResponse.push(dataRes)
      }),
    )
    return dataResponse
  }

  public async getDataforDepartmentCount(
    id: number,
  ): Promise<IDepartmentResponse> {
    const getActiveTime = await this.timeService.findActive()
    const data = await this.findById(id)
    const dataResponse: IDepartmentResponse = {
      countClasses: 0,
      countStudents: 0,
    }
    const classIdsWh = []
    data.forEach(function (arrayItem) {
      classIdsWh.push(arrayItem.classId)
    })
    if (classIdsWh.length > 0) {
      const classIdWh: IClassIds = {
        classIds: classIdsWh,
      }
      const classWh = await firstValueFrom<IClassResponse[]>(
        this.client.send({ role: 'class', cmd: 'get-class' }, classIdWh),
      )
      const classReponse: IClassResponse[] = classWh
      await Promise.all(
        classReponse.map(async (arrayItem) => {
          const students: IStudents[] = arrayItem.students
          const student = students.find((student) => {
            return (
              student.startYear === getActiveTime.startYear &&
              student.endYear === getActiveTime.endYear
            )
          })
          if (arrayItem.classId) {
            dataResponse.countClasses += 1
            dataResponse.countStudents += student.studentsIds.length
          }
        }),
      )
    }
    return dataResponse
  }
}
