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
} from 'src/config/end-point'
import {
  IClassIds,
  IClassResponse,
  ICreateClassWebhook,
  IStudents,
} from './interface/create-class-webhook.interface'
import { DepartmentService } from '../department/department.service'
import { ClassResponseDepartmentDto } from './dto/class-response-department.dto'
import { CourseService } from '../course/course.service'
import { TeachersService } from '../teachers/teachers.service'

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

  private async findName(id: number) {
    const data = await this.classRepository.findOne({ classId: id })
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
    const createClass = await this.classRepository.save(dto)
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
}
