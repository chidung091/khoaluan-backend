import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ClassService } from '../class/class.service'
import { TeachersService } from '../teachers/teachers.service'
import { Role } from '../users/users.enum'
import { UsersService } from '../users/users.service'
import { CreateDepartmentDto } from './dto/create-department.dto'
import { ResponseDepartmentDto } from './dto/response.dto'
import { Department } from './entity/department.entity'

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
    private teachersService: TeachersService,
    @Inject(forwardRef(() => ClassService))
    private classService: ClassService,
  ) {}

  public async findAll() {
    const data = await this.departmentRepository.find()
    const dataRes: ResponseDepartmentDto[] = []
    await Promise.all(
      data.map(async (arrayItem) => {
        const data = await this.classService.getDataforDepartmentCount(
          arrayItem.departmentId,
        )
        const countTeacher = await this.teachersService.countTeachers(
          arrayItem.departmentId,
        )
        const departmentAdminName = await this.teachersService.findName(
          arrayItem.departmentAdminUserID,
        )
        const dataObj: ResponseDepartmentDto = {
          departmentId: arrayItem.departmentId,
          departmentName: arrayItem.departmentName,
          information: arrayItem.information,
          departmentAdminName: departmentAdminName,
          countStudent: data.countStudents,
          countClasses: data.countClasses,
          countTeachers: countTeacher,
        }
        dataRes.push(dataObj)
      }),
    )
    return dataRes
  }

  public async findListTeachers(id: number) {
    const data = await this.findById(id)
    const dataResponse = await this.teachersService.findByDepartmentId(
      data.departmentId,
    )
    return dataResponse
  }

  public async findById(id: number): Promise<Department> {
    return this.departmentRepository
      .createQueryBuilder('department')
      .leftJoinAndSelect('department.departmentAdmin', 'userID')
      .where('department.departmentAdminUserID = :id', { id: id })
      .getOne()
  }

  public async findDepartment(id: number) {
    const data = await this.findById(id)
    return data
  }

  public async create(dto: CreateDepartmentDto): Promise<Department> {
    const user = await this.userService.getById(dto.departmentAdminUserID)
    if (!user) {
      throw new NotFoundException('NOT_FOUND_ADMIN_USER_ID')
    }
    if (user.role !== Role.Department) {
      throw new BadRequestException('ONLY ACCEPTED Department Role account id')
    }
    const departmentStatus = await this.departmentRepository.findOne(
      dto.departmentId,
    )
    if (departmentStatus) {
      throw new BadRequestException(
        'PLEASE_UPDATE_THIS_ID_INSTEAD_CREATED_NEW_ONE',
      )
    }
    const department = {
      ...dto,
      departmentAdmin: user,
    }
    const dataResponse = await this.departmentRepository.save(department)
    dataResponse.departmentAdmin = undefined
    return dataResponse
  }
}
