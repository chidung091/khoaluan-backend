import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Role } from '../users/users.enum'
import { UsersService } from '../users/users.service'
import { CreateDepartmentDto } from './dto/create-department.dto'
import { Department } from './entity/department.entity'

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    private userService: UsersService,
  ) {}

  public async findAll() {
    return this.departmentRepository.find()
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
