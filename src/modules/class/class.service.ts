import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { firstValueFrom } from 'rxjs'
import { HttpService } from '@nestjs/axios'
import { Repository } from 'typeorm'
import { CreateClassDto } from './dto/create-class.dto'
import { Class } from './entity/class.entity'
import { API_KEY } from 'src/config/secrets'
import {
  RATING_SERVICE_CREATE_CLASSS,
  RATING_SERVICE_GET_CLASS,
  RATING_SERVICE_GET_CLASS_DETAIL,
  RATING_SERVICE_GET_CLASS_HEADMASTER,
} from 'src/config/end-point'
import {
  IClassId,
  IClassIds,
  IClassResponse,
  ICreateClassWebhook,
  IDepartmentResponse,
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

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    private httpService: HttpService,
    private departmentService: DepartmentService,
    private courseService: CourseService,
    private teachersService: TeachersService,
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
      semester: 1,
      studentsIds: dto.studentsIds,
      startYear: 2018,
      endYear: 2019,
      headMasterId: dto.headMasterId,
      monitorId: 675105036,
    }
    const classWh: ICreateClassWebhook = {
      classId: dto.classId,
      courseId: dto.classCourseCourseId,
      students: [studentWh],
    }
    const createClassWebhook = await firstValueFrom(
      this.httpService.post<ICreateClassWebhook>(
        `${RATING_SERVICE_CREATE_CLASSS}`,
        classWh,
        { headers: { 'api-key': API_KEY } },
      ),
    )
    await this.classRepository.save(dto)
    const responseData: ICreateClassWebhook = createClassWebhook.data
    console.log(responseData.students)
    return 'true'
  }

  public async findAllClassByDepartmemt(id: number) {
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
      const classWh = await firstValueFrom(
        this.httpService.post<IClassResponse[]>(
          `${RATING_SERVICE_GET_CLASS}`,
          classIdWh,
          {
            headers: { 'api-key': API_KEY },
          },
        ),
      )
      const classReponse: IClassResponse[] = classWh.data
      const classReponsee: ClassResponseDepartmentDto[] = []
      await Promise.all(
        classReponse.map(async (arrayItem) => {
          const students: IStudents[] = arrayItem.students
          const student = students.find((student) => {
            return student.startYear === 2018 && student.endYear === 2019
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
    const classWh = await firstValueFrom(
      this.httpService.post<IClassResponse>(
        `${RATING_SERVICE_GET_CLASS_DETAIL}`,
        classIdWh,
        {
          headers: { 'api-key': API_KEY },
        },
      ),
    )
    const students = classWh.data.students
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
    console.log(id)
    const classIdWh: IMonitorId = {
      monitorId: id,
    }
    const classWh = await firstValueFrom(
      this.httpService.post<IClassResponse[]>(
        `${RATING_SERVICE_GET_CLASS}`,
        classIdWh,
        {
          headers: { 'api-key': API_KEY },
        },
      ),
    )
    return classWh.data
  }

  public async findAllClassByHeadMaster(id: number) {
    const classIdWh: ITeacher = {
      headMasterId: id,
      startYear: 2018,
      endYear: 2019,
      semester: 1,
    }
    const classWh = await firstValueFrom(
      this.httpService.post<[number]>(
        `${RATING_SERVICE_GET_CLASS_HEADMASTER}`,
        classIdWh,
        {
          headers: { 'api-key': API_KEY },
        },
      ),
    )
    const dataResponse: ClassResponseHeadMasterDto[] = []
    await Promise.all(
      classWh.data.map(async (arrayItem) => {
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
      const classWh = await firstValueFrom(
        this.httpService.post<IClassResponse[]>(
          `${RATING_SERVICE_GET_CLASS}`,
          classIdWh,
          {
            headers: { 'api-key': API_KEY },
          },
        ),
      )
      const classReponse: IClassResponse[] = classWh.data
      await Promise.all(
        classReponse.map(async (arrayItem) => {
          const students: IStudents[] = arrayItem.students
          const student = students.find((student) => {
            return student.startYear === 2018 && student.endYear === 2019
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
