import { HttpService } from '@nestjs/axios'
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { InjectRepository } from '@nestjs/typeorm'
import { firstValueFrom } from 'rxjs'
import { Repository } from 'typeorm'
import { ClassService } from '../class/class.service'
import { TimeService } from '../time/time.service'
import { UsersService } from '../users/users.service'
import { Role } from './detail-users.enum'
import {
  IHeadMaster,
  IHeadMasterResponse,
  IHeadMasterSearch,
  IMonitor,
  IMonitorSearch,
  IScoreRequest,
  IStudentMonitorResponse,
} from './detail-users.interface'
import { DetailUsersHeadMasterResponseDto } from './dto/detail-users-headmaster.response.dto'
import { DetailUsersMonitorResponseDto } from './dto/detail-users-monitor.response.dto'
import { CreateDetailUsersDto } from './dto/detail-users.dto'
import { DetailUsers } from './entity/detail-users.entity'

@Injectable()
export class DetailUsersService {
  constructor(
    @Inject('RATING_SERVICE')
    private readonly client: ClientProxy,
    @InjectRepository(DetailUsers)
    private detailUsersRepository: Repository<DetailUsers>,
    private httpService: HttpService,
    private classService: ClassService,
    private timeService: TimeService,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  public async findById(id: number): Promise<DetailUsers> {
    return this.detailUsersRepository
      .createQueryBuilder('detail_users')
      .leftJoinAndSelect('detail_users.users', 'userID')
      .where('detail_users.usersUserID = :id', { id: id })
      .getOne()
  }

  public async findByIds(ids: Array<number>): Promise<DetailUsers[]> {
    return this.detailUsersRepository
      .createQueryBuilder('detail_users')
      .leftJoinAndSelect('detail_users.users', 'userID')
      .where('detail_users.usersUserID IN (:id)', { id: ids })
      .orderBy('detail_users.createdAt')
      .getMany()
  }

  public async update(
    id: number,
    dto: CreateDetailUsersDto,
  ): Promise<DetailUsers> {
    const data = await this.findById(id)
    const oldData = await this.detailUsersRepository.findOne(data.id)
    const newData = oldData
    if (dto.imageUrls) {
      newData.birthDate = dto.birthDate
    }
    if (dto.imageUrls) {
      newData.imageUrls = dto.imageUrls
    }
    if (dto.email) {
      await this.userService.updateEmail(id, dto.email)
    }
    return this.detailUsersRepository.save({
      ...oldData,
      ...newData,
    })
  }

  public async findAllClassByMonitor(id: number) {
    const getActiveTime = await this.timeService.findActive()

    const classIdWh: IMonitor = {
      monitorId: id,
      startYear: getActiveTime.startYear,
      endYear: getActiveTime.endYear,
      semester: getActiveTime.semester,
    }
    const classWh = await firstValueFrom<[number]>(
      this.client.send({ role: 'class', cmd: 'get-class-monitor' }, classIdWh),
    )
    const data = await this.findByIds(classWh)
    const dataResponse: DetailUsersMonitorResponseDto[] = []
    await Promise.all(
      data.map(async (arrayItem) => {
        const requestStudent: IScoreRequest = {
          studentId: arrayItem.users.userID,
          type: Role.Student,
        }
        const requestMonitor: IScoreRequest = {
          studentId: arrayItem.users.userID,
          type: Role.Monitor,
        }
        const studentScore = await firstValueFrom<number>(
          this.client.send({ role: 'mark', cmd: 'get-score' }, requestStudent),
        )
        const monitorScore = await firstValueFrom<number>(
          this.client.send({ role: 'mark', cmd: 'get-score' }, requestMonitor),
        )
        const dataRes: DetailUsersMonitorResponseDto = {
          userID: arrayItem.users.userID,
          name: arrayItem.name,
          studentScore: studentScore,
          monitorScore: monitorScore,
        }
        dataResponse.push(dataRes)
      }),
    )
    return dataResponse
  }

  public async updateStudentToMonitor(studentId: number, userId: number) {
    const getActiveTime = await this.timeService.findActive()

    const classIdWh: IHeadMasterSearch = {
      startYear: getActiveTime.startYear,
      endYear: getActiveTime.endYear,
      semester: getActiveTime.semester,
      headMasterId: userId,
      studentId: studentId,
    }

    const classWh = await firstValueFrom<IStudentMonitorResponse>(
      this.client.send(
        { role: 'class', cmd: 'get-student-monitor-headmaster' },
        classIdWh,
      ),
    )
    const oldMonitorId = classWh.oldMonitorId
    const classNewWh = await firstValueFrom<IStudentMonitorResponse>(
      this.client.send(
        { role: 'class', cmd: 'update-student-monitor-headmaster' },
        classIdWh,
      ),
    )
    if (!classNewWh) {
      throw new BadRequestException('Error')
    }
    await this.userService.updateRole(studentId, Role.Monitor)
    await this.userService.updateRole(oldMonitorId, Role.Student)
    return 'Success'
  }

  public async findAllStudentByHeadMaster(classId: number, id: number) {
    const getActiveTime = await this.timeService.findActive()

    const classIdWh: IHeadMaster = {
      startYear: getActiveTime.startYear,
      endYear: getActiveTime.endYear,
      semester: getActiveTime.semester,
      headMasterId: id,
      classId: classId,
    }
    const classWh = await firstValueFrom<IHeadMasterResponse[]>(
      this.client.send(
        { role: 'class', cmd: 'get-class-headmaster' },
        classIdWh,
      ),
    )
    const dataResponse: DetailUsersHeadMasterResponseDto[] = []
    await Promise.all(
      classWh.map(async (arrayItem) => {
        const requestStudent: IScoreRequest = {
          studentId: arrayItem.id,
          type: Role.Student,
        }
        const requestMonitor: IScoreRequest = {
          studentId: arrayItem.id,
          type: Role.Monitor,
        }
        const requestTeacher: IScoreRequest = {
          studentId: arrayItem.id,
          type: Role.Teacher,
        }
        const studentScore = await firstValueFrom<number>(
          this.client.send({ role: 'mark', cmd: 'get-score' }, requestStudent),
        )
        const monitorScore = await firstValueFrom<number>(
          this.client.send({ role: 'mark', cmd: 'get-score' }, requestMonitor),
        )
        const teacherScore = await firstValueFrom<number>(
          this.client.send({ role: 'mark', cmd: 'get-score' }, requestTeacher),
        )
        const role = await this.userService.getRole(arrayItem.id)
        const dataRes: DetailUsersHeadMasterResponseDto = {
          userID: arrayItem.id,
          name: await (await this.findById(arrayItem.id)).name,
          className: await this.classService.findName(arrayItem.classId),
          studentScore: studentScore,
          monitorScore: monitorScore,
          teacherScore: teacherScore,
          role: role,
        }
        dataResponse.push(dataRes)
      }),
    )
    return dataResponse
  }

  async findStudentIdHeadmaster(studentId: number, id: number) {
    const getActiveTime = await this.timeService.findActive()

    const classIdWh: IHeadMasterSearch = {
      startYear: getActiveTime.startYear,
      endYear: getActiveTime.endYear,
      semester: getActiveTime.semester,
      headMasterId: id,
      studentId: studentId,
    }
    const classWh = await firstValueFrom<IHeadMasterResponse[]>(
      this.client.send(
        { role: 'class', cmd: 'get-student-list-headmaster' },
        classIdWh,
      ),
    )
    const dataResponse: DetailUsersHeadMasterResponseDto[] = []
    await Promise.all(
      classWh.map(async (arrayItem) => {
        const requestStudent: IScoreRequest = {
          studentId: arrayItem.id,
          type: Role.Student,
        }
        const requestMonitor: IScoreRequest = {
          studentId: arrayItem.id,
          type: Role.Monitor,
        }
        const requestTeacher: IScoreRequest = {
          studentId: arrayItem.id,
          type: Role.Teacher,
        }
        const studentScore = await firstValueFrom<number>(
          this.client.send({ role: 'mark', cmd: 'get-score' }, requestStudent),
        )
        const monitorScore = await firstValueFrom<number>(
          this.client.send({ role: 'mark', cmd: 'get-score' }, requestMonitor),
        )
        const teacherScore = await firstValueFrom<number>(
          this.client.send({ role: 'mark', cmd: 'get-score' }, requestTeacher),
        )
        const role = await this.userService.getRole(arrayItem.id)
        const dataRes: DetailUsersHeadMasterResponseDto = {
          userID: arrayItem.id,
          name: await (await this.findById(arrayItem.id)).name,
          className: await this.classService.findName(arrayItem.classId),
          studentScore: studentScore,
          monitorScore: monitorScore,
          teacherScore: teacherScore,
          role: role,
        }
        dataResponse.push(dataRes)
      }),
    )
    return dataResponse
  }

  async findStudentIdMonitor(studentId: number, id: number) {
    const getActiveTime = await this.timeService.findActive()

    const classIdWh: IMonitorSearch = {
      monitorId: id,
      startYear: getActiveTime.startYear,
      endYear: getActiveTime.endYear,
      semester: getActiveTime.semester,
      studentId: studentId,
    }
    const classWh = await firstValueFrom<[number]>(
      this.client.send(
        { role: 'class', cmd: 'get-student-list-monitor' },
        classIdWh,
      ),
    )
    const data = await this.findByIds(classWh)
    const dataResponse: DetailUsersMonitorResponseDto[] = []
    await Promise.all(
      data.map(async (arrayItem) => {
        const requestStudent: IScoreRequest = {
          studentId: arrayItem.users.userID,
          type: Role.Student,
        }
        const requestMonitor: IScoreRequest = {
          studentId: arrayItem.users.userID,
          type: Role.Monitor,
        }
        const studentScore = await firstValueFrom<number>(
          this.client.send({ role: 'mark', cmd: 'get-score' }, requestStudent),
        )
        const monitorScore = await firstValueFrom<number>(
          this.client.send({ role: 'mark', cmd: 'get-score' }, requestMonitor),
        )
        const dataRes: DetailUsersMonitorResponseDto = {
          userID: arrayItem.users.userID,
          name: arrayItem.name,
          studentScore: studentScore,
          monitorScore: monitorScore,
        }
        dataResponse.push(dataRes)
      }),
    )
    return dataResponse
  }
}
