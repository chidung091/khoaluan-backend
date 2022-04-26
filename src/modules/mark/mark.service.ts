import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ClassService } from '../class/class.service'
import { DetailUsersService } from '../detail-users/detail-users.service'
import { TimeService } from '../time/time.service'
import { UsersService } from '../users/users.service'
import { CreateMarkDto } from './dto/create-mark-dto'
import { MarkDetail } from './entity/mark-detail.entity'
import { Mark } from './entity/mark.entity'

@Injectable()
export class MarkService {
  constructor(
    @InjectRepository(Mark)
    private markRepository: Repository<Mark>,
    @InjectRepository(MarkDetail)
    private markDetailRepository: Repository<MarkDetail>,
    @Inject(forwardRef(() => DetailUsersService))
    private detailUsersService: DetailUsersService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    @Inject(forwardRef(() => ClassService))
    private classService: ClassService,
    @Inject(forwardRef(() => TimeService))
    private timeService: TimeService,
  ) {}

  async createMarkStudent(id: number, dto: CreateMarkDto) {
    const getTimeActiveData = await this.timeService.findActive()
    const data = await this.detailUsersService.findById(id)
    const classId = data.usersClassClassId
    const classData = await this.classService.find(classId)
    const findData = await this.markRepository.findOne({
      class: classData,
      startYear: getTimeActiveData.startYear,
      endYear: getTimeActiveData.endYear,
      semester: getTimeActiveData.semester,
    })
    const dataResponse = []
    if (!findData) {
      const newMark = {
        class: classData,
        startYear: getTimeActiveData.startYear,
        endYear: getTimeActiveData.endYear,
        semester: getTimeActiveData.semester,
      }
      const createMark = await this.markRepository.save(newMark)
      await Promise.all(
        dto.markDetail.map(async (mark) => {
          const findData = await this.markRepository.findOne(createMark.markId)
          const findDetail = await this.markDetailRepository.findOne({
            pointId: mark.pointId,
            mark: findData,
          })
          if (!findDetail) {
            const findDetailUserId = await this.detailUsersService.findById(id)
            const newMarkDetail = {
              detailUser: findDetailUserId,
              mark: findData,
              pointId: mark.pointId,
              studentScore: mark.studentScore,
            }
            const createMarkDetail = await this.markDetailRepository.save(
              newMarkDetail,
            )
            dataResponse.push(createMarkDetail)
          } else {
            const newDetail = findDetail
            newDetail.studentScore = mark.studentScore
            const createMarkDetail = await this.markDetailRepository.save({
              ...findDetail,
              ...newDetail,
            })
            dataResponse.push(createMarkDetail)
          }
        }),
      )
    } else {
      await Promise.all(
        dto.markDetail.map(async (mark) => {
          const findDetail = await this.markDetailRepository.findOne({
            pointId: mark.pointId,
            mark: findData,
          })
          if (!findDetail) {
            const findDetailUserId = await this.detailUsersService.findById(id)
            const newMarkDetail = {
              detailUser: findDetailUserId,
              mark: findData,
              pointId: mark.pointId,
              studentScore: mark.studentScore,
            }
            const createMarkDetail = await this.markDetailRepository.save(
              newMarkDetail,
            )
            dataResponse.push(createMarkDetail)
          } else {
            const newDetail = findDetail
            newDetail.studentScore = mark.studentScore
            console.log(newDetail)
            const createMarkDetail = await this.markDetailRepository.save({
              ...findDetail,
              ...newDetail,
            })
            dataResponse.push(createMarkDetail)
          }
        }),
      )
    }
    return dataResponse
  }
}
