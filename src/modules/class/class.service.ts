import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { HttpService } from '@nestjs/axios'
import { Repository } from 'typeorm'
import { CreateClassDto } from './dto/create-class.dto'
import { Class } from './entity/class.entity'
import {
  ICreateClassWebhook,
  IDepartmentResponse,
  IStudents,
} from './interface/create-class-webhook.interface'
import { DepartmentService } from '../department/department.service'
import { CourseService } from '../course/course.service'
import { TeachersService } from '../teachers/teachers.service'
import { ClientProxy } from '@nestjs/microservices'
import { TimeService } from '../time/time.service'
import { CreateNewClassDto } from './dto/create-new-class.dto'
import { DetailUsersService } from '../detail-users/detail-users.service'

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
    @Inject(forwardRef(() => DetailUsersService))
    private detailUsersService: DetailUsersService,
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

  public async find(id: number) {
    const data = await this.classRepository.findOne(id)
    if (!data) {
      throw new NotFoundException('NOT_FOUND_CLASS')
    }
    return data
  }

  public async findHeadMasterId(id: number) {
    const data = await this.classRepository.findOne({ headMasterId: id })
    if (!data) {
      throw new NotFoundException('NOT_FOUND_CLASS')
    }
    return data
  }

  public async createClass(dto: CreateClassDto) {
    const getActiveTime = await this.timeService.findActive()

    const studentWh: IStudents = {
      semester: getActiveTime.semester,
      studentsIds: dto.studentsIds,
      startYear: getActiveTime.startYear,
      endYear: getActiveTime.endYear,
      headMasterId: dto.headMasterId,
      monitorId: dto.monitorId,
    }
    const data = await this.classRepository.save(dto)
    const classWh: ICreateClassWebhook = {
      classId: data.classId,
      courseId: dto.classCourseCourseId,
      students: [studentWh],
    }
    const user = this.client.emit<ICreateClassWebhook>(
      { role: 'class', cmd: 'create' },
      classWh,
    )
    return user
  }

  public async createNewClass(dto: CreateNewClassDto) {
    return this.classRepository.save(dto)
  }

  public async findAllClassByDepartmemt(id: number) {
    const department = await this.departmentService.findDepartment(id)
    const data = await this.findById(department.departmentId)
    return data
  }

  public async findDetailClass(id: number) {
    const data = await this.classRepository.findOne(id)
    if (!data) {
      throw new NotFoundException('NOT_FOUND_CLASS')
    }
    return this.classRepository.findOne(id)
  }

  public async findAllClassByMonitor(id: number) {
    const data = await this.classRepository.findOne({ monitorId: id })
    if (!data) {
      throw new NotFoundException('NOT_FOUND_CLASS')
    }
    return data
  }

  public async findAllClassByHeadMaster(id: number) {
    const data = await this.classRepository.find({ headMasterId: id })
    if (!data) {
      throw new NotFoundException('NOT_FOUND_CLASS')
    }
    return data
  }

  public async getDataforDepartmentCount(
    id: number,
  ): Promise<IDepartmentResponse> {
    const data = await this.findById(id)
    const dataResponse: IDepartmentResponse = {
      countClasses: data.length,
      countStudents: 0,
    }
    await Promise.all(
      data.map(async (item) => {
        const dataStudent = await this.detailUsersService.findByClassId(
          item.classId,
        )
        dataResponse.countStudents += dataStudent.length
      }),
    )
    return dataResponse
  }

  public async updateClassMonitor(classId: number, newMonitorId: number) {
    const data = await this.classRepository.findOne(classId)
    if (!data) {
      throw new BadRequestException('BAD')
    }
    const dataNew = data
    dataNew.monitorId = newMonitorId
    return this.classRepository.save({
      ...data, // existing fields
      ...dataNew, // updated fields
    })
  }
}
