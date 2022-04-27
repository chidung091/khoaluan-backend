import { HttpService } from '@nestjs/axios'
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ClassService } from '../class/class.service'
import { TimeService } from '../time/time.service'
import { UsersService } from '../users/users.service'
import { Role } from './detail-users.enum'
import { DetailUsersHeadMasterResponseDto } from './dto/detail-users-headmaster.response.dto'
import { DetailUsersMonitorResponseDto } from './dto/detail-users-monitor.response.dto'
import { CreateDetailUsersDto } from './dto/detail-users.dto'
import { DetailUsers } from './entity/detail-users.entity'
import * as xlsx from 'xlsx'
import { WorkBook, WorkSheet } from 'xlsx'
import { ReadStream } from 'typeorm/platform/PlatformTools'
import fileToArrayBuffer from 'file-to-array-buffer'
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

  public async findId(id: number): Promise<DetailUsers> {
    return this.detailUsersRepository.findOne(id)
  }

  public async findByClassId(id: number): Promise<DetailUsers[]> {
    return this.detailUsersRepository
      .createQueryBuilder('detail_users')
      .leftJoinAndSelect('detail_users.usersClass', 'classId')
      .where('detail_users.usersClassClassId = :id', { id: id })
      .orderBy('detail_users.createdAt')
      .getMany()
  }

  public async findByIds(ids: Array<number>): Promise<DetailUsers[]> {
    return this.detailUsersRepository
      .createQueryBuilder('detail_users')
      .leftJoinAndSelect('detail_users.users', 'userID')
      .where('detail_users.usersUserID IN (:id)', { id: ids })
      .orderBy('detail_users.createdAt')
      .getMany()
  }

  public async findByNewIds(ids: Array<number>): Promise<DetailUsers[]> {
    return this.detailUsersRepository.findByIds(ids)
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
    const dataClass = await this.classService.findAllClassByMonitor(id)
    const dataStudent = await this.findByClassId(dataClass.classId)
    const dataArray = []
    await Promise.all(
      dataStudent.map(async (arrayItem) => {
        dataArray.push(arrayItem.id)
      }),
    )
    const data = await this.findByNewIds(dataArray)
    const dataResponse: DetailUsersMonitorResponseDto[] = []
    await Promise.all(
      data.map(async (arrayItem) => {
        const dataRes: DetailUsersMonitorResponseDto = {
          userID: arrayItem.usersUserID,
          name: arrayItem.name,
          studentScore: 0,
          monitorScore: 0,
        }
        dataResponse.push(dataRes)
      }),
    )
    return dataResponse
  }

  public async updateStudentToMonitor(studentId: number, userId: number) {
    const data = await this.classService.findAllClassByHeadMaster(userId)
    const findClassId = await this.findById(studentId)
    findClassId.usersClassClassId
    await Promise.all(
      data.map(async (arrayItem) => {
        if (arrayItem.classId === findClassId.usersClassClassId) {
          await this.userService.updateRole(studentId, Role.Monitor)
          await this.userService.updateRole(arrayItem.monitorId, Role.Student)
          await this.classService.updateClassMonitor(
            arrayItem.classId,
            studentId,
          )
          return 'Success'
        }
      }),
    )
    return 'Fail'
  }

  public async findAllStudentByHeadMaster(classId: number, id: number) {
    const classNew = await this.classService.findAllClassByHeadMaster(id)
    const dataResponse: DetailUsersHeadMasterResponseDto[] = []
    await Promise.all(
      classNew.map(async (arrayItem) => {
        const dataStudent = await this.findByClassId(arrayItem.classId)
        await Promise.all(
          dataStudent.map(async (item) => {
            const role = await this.userService.getRole(item.usersUserID)
            const dataRes: DetailUsersHeadMasterResponseDto = {
              userID: item.usersUserID,
              name: await (await this.findById(item.usersUserID)).name,
              className: await this.classService.findName(arrayItem.classId),
              studentScore: 0,
              monitorScore: 0,
              teacherScore: 0,
              role: role,
            }
            dataResponse.push(dataRes)
          }),
        )
      }),
    )
    return dataResponse
  }

  async findStudentIdHeadmaster(studentId: number, id: number) {
    if (!studentId) {
      return this.classService.findAllClassByDepartmemt(id)
    }
    const data = await this.findById(studentId)
    if (!data) {
      throw new BadRequestException(`can't find data`)
    }
    const dataResponse: DetailUsersHeadMasterResponseDto[] = []
    const role = await this.userService.getRole(data.usersUserID)
    const dataRes: DetailUsersHeadMasterResponseDto = {
      userID: data.usersUserID,
      name: data.name,
      className: data.usersClass.className,
      studentScore: 0,
      monitorScore: 0,
      teacherScore: 0,
      role: role,
    }
    dataResponse.push(dataRes)
    return dataResponse
  }

  async findStudentIdMonitor(studentId: number, id: number) {
    if (!studentId) {
      return this.classService.findAllClassByMonitor(id)
    }
    const data = await this.findById(studentId)
    if (!data) {
      throw new BadRequestException(`can't find data`)
    }
    const dataResponse: DetailUsersMonitorResponseDto[] = []
    const dataRes: DetailUsersMonitorResponseDto = {
      userID: data.usersUserID,
      name: data.name,
      studentScore: 0,
      monitorScore: 0,
    }
    dataResponse.push(dataRes)
    return dataResponse
  }

  async importExcelFile(file: Express.Multer.File) {
    const newFile = xlsx.readFile(file.path)
    const sheet: WorkSheet = newFile.Sheets[newFile.SheetNames[0]]
    const range = xlsx.utils.decode_range(sheet['!ref'])
    console.log(sheet)
    console.log(range)
    return file
  }
}
