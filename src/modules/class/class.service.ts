import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { firstValueFrom } from 'rxjs'
import { HttpService } from '@nestjs/axios'
import { Repository } from 'typeorm'
import { CreateClassDto } from './dto/create-class.dto'
import { Class } from './entity/class.entity'
import { API_KEY } from 'src/config/secrets'
import { RATING_SERVICE_CREATE_CLASSS } from 'src/config/end-point'
import {
  ICreateClassWebhook,
  IStudents,
} from './interface/create-class-webhook.interface'

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    private httpService: HttpService,
  ) {}

  public async createClass(dto: CreateClassDto) {
    const studentWh: IStudents = {
      semester: 1,
      studentsIds: dto.studentsIds,
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
    // const createClass = await this.classRepository.save(dto)
    const responseData: ICreateClassWebhook = createClassWebhook.data
    console.log(responseData.students)
    return 'true'
  }
}
