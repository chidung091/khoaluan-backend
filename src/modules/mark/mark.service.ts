import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ClassService } from '../class/class.service'
import { DepartmentService } from '../department/department.service'
import { DetailUsersService } from '../detail-users/detail-users.service'
import { TeachersService } from '../teachers/teachers.service'
import { TimeService } from '../time/time.service'
import { Role } from '../users/users.enum'
import { UsersService } from '../users/users.service'
import {
  CreateMarkDto,
  CreateMarkMonitorDto,
  CreateMarkTeacherDto,
} from './dto/create-mark-dto'
import { MarkDetail } from './entity/mark-detail.entity'
import { Mark } from './entity/mark.entity'
import { Status } from './mark.enum'

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
    @Inject(forwardRef(() => TeachersService))
    private teachersService: TeachersService,
    @Inject(forwardRef(() => ClassService))
    private classService: ClassService,
    @Inject(forwardRef(() => TimeService))
    private timeService: TimeService,
    @Inject(forwardRef(() => DepartmentService))
    private departmentService: DepartmentService,
  ) {}

  async getListMarkDepartment(id: number) {
    const getListClass = await this.classService.findAllClassByDepartmemt(id)
    const getTimeActiveData = await this.timeService.findActive()
    const dataResponse = []
    await Promise.all(
      getListClass.map(async (singleClass) => {
        const classData = await this.classService.find(singleClass.classId)
        const findData = await this.markRepository.findOne({
          class: classData,
          startYear: getTimeActiveData.startYear,
          endYear: getTimeActiveData.endYear,
          semester: getTimeActiveData.semester,
        })
        const dataDetailUsers = await this.detailUsersService.findByClassId(
          singleClass.classId,
        )
        if (findData) {
          const data = {
            classId: singleClass.classId,
            className: singleClass.className,
            markId: findData.markId ?? 0,
            teacherName: await (
              await this.teachersService.findById(singleClass.headMasterId)
            ).teacherName,
            totalStudent: dataDetailUsers.length,
            startYear: getTimeActiveData.startYear,
            endYear: getTimeActiveData.endYear,
            semester: getTimeActiveData.semester,
            status: findData.status,
          }
          dataResponse.push(data)
        } else {
          const data = {
            classId: singleClass.classId,
            className: singleClass.className,
            markId: 0,
            totalStudent: 0,
            startYear: getTimeActiveData.startYear,
            endYear: getTimeActiveData.endYear,
            semester: getTimeActiveData.semester,
            status: 0,
          }
          dataResponse.push(data)
        }
      }),
    )
    return dataResponse
  }

  async getDetailMark(markId: number) {
    const findData = await this.markRepository.findOne(markId)
    const dataDetailUsers = await this.detailUsersService.findByClassId(
      findData.classClassId,
    )
    const dataResponse = []
    await Promise.all(
      dataDetailUsers.map(async (single) => {
        const findDetail = await this.markDetailRepository.find({
          detailUser: single,
          mark: findData,
        })
        if (findDetail.length > 0) {
          let totalStudentScore = 0
          let totalMonitorScore = 0
          let totalTeacherScore = 0

          await Promise.all(
            findDetail.map((singleDetail) => {
              totalStudentScore += singleDetail.studentScore
              totalMonitorScore += singleDetail.monitorScore
              totalTeacherScore += singleDetail.teacherScore
            }),
          )
          const data = {
            userID: single.usersUserID,
            name: single.name,
            haveMark: true,
            totalStudentScore: totalStudentScore,
            totalMonitorScore: totalMonitorScore,
            totalTeacherScore: totalTeacherScore,
          }
          dataResponse.push(data)
        } else {
          const newData = {
            userID: single.usersUserID,
            name: single.name,
            haveMark: false,
            totalStudentScore: 0,
            totalMonitorScore: 0,
            totalTeacherScore: 0,
          }
          dataResponse.push(newData)
        }
      }),
    )
    return dataResponse
  }

  async calculationScore(studentId: number) {
    const getTimeActiveData = await this.timeService.findActive()
    const data = await this.detailUsersService.findById(studentId)
    const classData = await this.classService.find(data.usersClassClassId)
    const findData = await this.markRepository.findOne({
      class: classData,
      startYear: getTimeActiveData.startYear,
      endYear: getTimeActiveData.endYear,
      semester: getTimeActiveData.semester,
    })
    const findDetailMark = await this.markDetailRepository.find({
      mark: findData,
      detailUser: data,
    })
    let totalStudentScore = 0
    let totalMonitorScore = 0
    let totalTeacherScore = 0
    if (!findDetailMark) {
      const res = {
        totalStudentScore: 0,
        totalMonitorScore: 0,
        totalTeacherScore: 0,
      }
      return res
    }
    await Promise.all(
      findDetailMark.map(async (single) => {
        totalStudentScore += single.studentScore
        totalMonitorScore += single.monitorScore
        totalTeacherScore += single.teacherScore
      }),
    )
    const res = {
      totalStudentScore: totalStudentScore,
      totalMonitorScore: totalMonitorScore,
      totalTeacherScore: totalTeacherScore,
    }
    return res
  }

  async getDetailMarkPages(studentId: number, role: Role, classId: number) {
    const getTimeActiveData = await this.timeService.findActive()
    if (role === Role.Teacher) {
      const classData = await this.classService.find(classId)
      const findData = await this.markRepository.findOne({
        class: classData,
        startYear: getTimeActiveData.startYear,
        endYear: getTimeActiveData.endYear,
        semester: getTimeActiveData.semester,
      })
      const findDetailUser = await this.detailUsersService.findById(studentId)
      if (!findData) {
        throw new BadRequestException(`Can't find`)
      }
      const findDetail = await this.markDetailRepository.find({
        mark: findData,
        detailUser: findDetailUser,
      })
      if (!findDetail) {
        throw new BadRequestException(`Chưa chấm điểm chi tiết`)
      }
      const className = await this.classService.findName(
        findDetailUser.usersClassClassId,
      )
      const dataResponse = {
        name: findDetailUser.name,
        birthDate: findDetailUser.birthDate,
        semester: findData.semester,
        startYear: findData.startYear,
        endYear: findData.endYear,
        className: className,
        detailMark: findDetail,
      }
      return dataResponse
    }
    const data = await this.detailUsersService.findById(studentId)
    const newClassId = data.usersClassClassId
    const classData = await this.classService.find(newClassId)
    const findData = await this.markRepository.findOne({
      class: classData,
      startYear: getTimeActiveData.startYear,
      endYear: getTimeActiveData.endYear,
      semester: getTimeActiveData.semester,
    })

    if (!findData) {
      throw new BadRequestException(`Can't find`)
    }

    const findDetail = await this.markDetailRepository.find({
      mark: findData,
      detailUser: data,
    })
    if (!findDetail) {
      throw new BadRequestException(`Chưa chấm điểm chi tiết`)
    }
    const className = await this.classService.findName(data.usersClassClassId)
    const dataResponse = {
      name: data.name,
      birthDate: data.birthDate,
      semester: findData.semester,
      startYear: findData.startYear,
      endYear: findData.endYear,
      className: className,
      detailMark: findDetail,
    }
    return dataResponse
  }

  async approveMark(markId: number) {
    const findData = await this.markRepository.findOne(markId)
    if (findData.status === Status.Approved) {
      throw new BadRequestException('You approved this!')
    }
    const newData = findData
    newData.status = Status.Approved
    return this.markRepository.save({
      ...findData,
      ...newData,
    })
  }
  async getMark(id: number, role: Role, classId: number) {
    const getTimeActiveData = await this.timeService.findActive()
    if (role === Role.Teacher) {
      const classData = await this.classService.find(classId)
      const findData = await this.markRepository.findOne({
        class: classData,
        startYear: getTimeActiveData.startYear,
        endYear: getTimeActiveData.endYear,
        semester: getTimeActiveData.semester,
      })

      if (!findData) {
        throw new BadRequestException(`Can't find`)
      }

      return findData
    }
    const data = await this.detailUsersService.findById(id)
    const newClassId = data.usersClassClassId
    const classData = await this.classService.find(newClassId)
    const findData = await this.markRepository.findOne({
      class: classData,
      startYear: getTimeActiveData.startYear,
      endYear: getTimeActiveData.endYear,
      semester: getTimeActiveData.semester,
    })

    if (!findData) {
      throw new BadRequestException(`Can't find`)
    }

    return findData
  }

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
          const findDetailUserId = await this.detailUsersService.findById(id)
          const findDetail = await this.markDetailRepository.findOne({
            pointId: mark.pointId,
            mark: findData,
            detailUser: findDetailUserId,
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
          const findDetailUserId = await this.detailUsersService.findById(id)
          const findDetail = await this.markDetailRepository.findOne({
            pointId: mark.pointId,
            mark: findData,
            detailUser: findDetailUserId,
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
    }
    return dataResponse
  }

  async createMarkMonitor(
    id: number,
    studentId: number,
    dto: CreateMarkMonitorDto,
  ) {
    const getTimeActiveData = await this.timeService.findActive()
    const data = await this.detailUsersService.findById(studentId)
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
          const findDetailUserId = await this.detailUsersService.findById(
            studentId,
          )
          const findDetail = await this.markDetailRepository.findOne({
            pointId: mark.pointId,
            mark: findData,
            detailUser: findDetailUserId,
          })
          if (!findDetail) {
            const findDetailUserId = await this.detailUsersService.findById(
              studentId,
            )
            const newMarkDetail = {
              detailUser: findDetailUserId,
              mark: findData,
              pointId: mark.pointId,
              monitorScore: mark.monitorScore,
            }
            const createMarkDetail = await this.markDetailRepository.save(
              newMarkDetail,
            )
            dataResponse.push(createMarkDetail)
          } else {
            const newDetail = findDetail
            newDetail.monitorScore = mark.monitorScore
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
          const findDetailUserId = await this.detailUsersService.findById(
            studentId,
          )
          const findDetail = await this.markDetailRepository.findOne({
            pointId: mark.pointId,
            mark: findData,
            detailUser: findDetailUserId,
          })
          if (!findDetail) {
            const findDetailUserId = await this.detailUsersService.findById(
              studentId,
            )
            const newMarkDetail = {
              detailUser: findDetailUserId,
              mark: findData,
              pointId: mark.pointId,
              monitorScore: mark.monitorScore,
            }
            const createMarkDetail = await this.markDetailRepository.save(
              newMarkDetail,
            )
            dataResponse.push(createMarkDetail)
          } else {
            const newDetail = findDetail
            newDetail.monitorScore = mark.monitorScore
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

  async createMarkTeacher(studentId: number, dto: CreateMarkTeacherDto) {
    const getTimeActiveData = await this.timeService.findActive()
    const data = await this.detailUsersService.findById(studentId)
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
          const findDetailUserId = await this.detailUsersService.findById(
            studentId,
          )
          const findDetail = await this.markDetailRepository.findOne({
            pointId: mark.pointId,
            mark: findData,
            detailUser: findDetailUserId,
          })
          if (!findDetail) {
            const findDetailUserId = await this.detailUsersService.findById(
              studentId,
            )
            const newMarkDetail = {
              detailUser: findDetailUserId,
              mark: findData,
              pointId: mark.pointId,
              teacherScore: mark.teacherScore,
            }
            const createMarkDetail = await this.markDetailRepository.save(
              newMarkDetail,
            )
            dataResponse.push(createMarkDetail)
          } else {
            const newDetail = findDetail
            newDetail.teacherScore = mark.teacherScore
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
          const findDetailUserId = await this.detailUsersService.findById(
            studentId,
          )
          const findDetail = await this.markDetailRepository.findOne({
            pointId: mark.pointId,
            mark: findData,
            detailUser: findDetailUserId,
          })
          if (!findDetail) {
            const findDetailUserId = await this.detailUsersService.findById(
              studentId,
            )
            const newMarkDetail = {
              detailUser: findDetailUserId,
              mark: findData,
              pointId: mark.pointId,
              teacherScore: mark.teacherScore,
            }
            const createMarkDetail = await this.markDetailRepository.save(
              newMarkDetail,
            )
            dataResponse.push(createMarkDetail)
          } else {
            const newDetail = findDetail
            newDetail.teacherScore = mark.teacherScore
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
