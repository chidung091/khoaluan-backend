import { HttpService } from '@nestjs/axios'
import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { InjectRepository } from '@nestjs/typeorm'
import { firstValueFrom } from 'rxjs'
import {
  RATING_SERVICE_GET_LIST_STUDENTS_BY_HEADMASTER,
  RATING_SERVICE_GET_LIST_STUDENTS_BY_MONITOR,
} from 'src/config/end-point'
import { API_KEY } from 'src/config/secrets'
import { Repository } from 'typeorm'
import { ClassService } from '../class/class.service'
import {
  IHeadMaster,
  IHeadMasterResponse,
  IMonitor,
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
    newData.birthDate = dto.birthDate
    return this.detailUsersRepository.save({
      ...oldData,
      ...newData,
    })
  }
  public async findAllClassByMonitor(id: number) {
    const classIdWh: IMonitor = {
      monitorId: id,
      startYear: 2018,
      endYear: 2019,
      semester: 1,
    }
    const classWh = await firstValueFrom<[number]>(
      this.client.send({ role: 'class', cmd: 'get-class-monitor' }, classIdWh),
    )
    const data = await this.findByIds(classWh)
    const dataResponse: DetailUsersMonitorResponseDto[] = []
    await Promise.all(
      data.map(async (arrayItem) => {
        const dataRes: DetailUsersMonitorResponseDto = {
          userID: arrayItem.users.userID,
          name: arrayItem.name,
        }
        dataResponse.push(dataRes)
      }),
    )
    return dataResponse
  }

  public async findAllStudentByHeadMaster(classId: number, id: number) {
    const classIdWh: IHeadMaster = {
      startYear: 2018,
      endYear: 2019,
      semester: 1,
      headMasterId: id,
      classId: classId,
    }
    const classWh = await firstValueFrom<IHeadMasterResponse[]>(
      this.client.send(
        { role: 'class', cmd: 'get-class-headmaster' },
        classIdWh,
      ),
    )
    const dataResponse: DetailUsersMonitorResponseDto[] = []
    await Promise.all(
      classWh.map(async (arrayItem) => {
        const dataRes: DetailUsersHeadMasterResponseDto = {
          userID: arrayItem.id,
          name: await (await this.findById(arrayItem.id)).name,
          className: await this.classService.findName(arrayItem.classId),
        }
        dataResponse.push(dataRes)
      }),
    )
    return dataResponse
  }
}
