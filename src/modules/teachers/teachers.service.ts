import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { WorkSheet } from 'xlsx'
import { DepartmentService } from '../department/department.service'
import { CreateUsersDto } from '../users/dto/create-users.dto'
import { UsersService } from '../users/users.service'
import { CreateTableTeacherDto } from './dto/create-teacher.dto'
import { Teachers } from './entity/teachers.entity'
import * as xlsx from 'xlsx'
import { CreateTeacherDto } from '../admin/dto/create-teacher.dto'
@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teachers)
    private teachersRepository: Repository<Teachers>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    @Inject(forwardRef(() => DepartmentService))
    private departmentService: DepartmentService,
  ) {}

  public async findById(id: number): Promise<Teachers> {
    return this.teachersRepository
      .createQueryBuilder('teachers')
      .leftJoinAndSelect('teachers.teacherUsers', 'userID')
      .where('teachers.teacherUsersUserID = :id', { id: id })
      .getOne()
  }

  public async countTeachers(id: number): Promise<number> {
    const data = await this.findByDepartmentId(id)
    return data.length
  }

  public async findByDepartmentId(id: number): Promise<Teachers[]> {
    return this.teachersRepository
      .createQueryBuilder('teachers')
      .leftJoinAndSelect('teachers.teacherDepartment', 'departmentId')
      .where('teachers.teacherDepartmentDepartmentId = :id', { id: id })
      .getMany()
  }

  public async findName(id: number) {
    const data = await this.findById(id)
    if (!data) {
      throw new NotFoundException('NOT_FOUND_TEACHERS')
    }
    return data.teacherName
  }
  public async createTeacher(dto: CreateTableTeacherDto, id: number) {
    const userData = await this.usersService.getById(id)
    const create = {
      ...dto,
      teacherUsers: userData,
    }
    return this.teachersRepository.save(create)
  }

  public async assignDepartment(userID: number, departmentId: number) {
    const data = await this.findById(userID)
    const newData = data
    const department = await this.departmentService.findDepartment(departmentId)
    newData.teacherDepartment = department
    return this.teachersRepository.save({
      ...data,
      ...newData,
    })
  }

  async importExcelFile(file: Express.Multer.File) {
    const newFile = xlsx.readFile(file.path)
    const sheet: WorkSheet = newFile.Sheets[newFile.SheetNames[0]]
    const range = xlsx.utils.decode_range(sheet['!ref'])
    for (let R = range.s.r; R < range.e.r; ++R) {
      const userID = sheet[xlsx.utils.encode_cell({ c: 0, r: R + 1 })]?.v
      const name = sheet[xlsx.utils.encode_cell({ c: 1, r: R + 1 })]?.v
      const password = sheet[xlsx.utils.encode_cell({ c: 2, r: R + 1 })]?.v
      const departmentId = sheet[xlsx.utils.encode_cell({ c: 3, r: R + 1 })]?.v
      const newUser: CreateUsersDto = {
        userID: userID,
        password: password,
        email: userID + '@gmail.com',
      }
      const createUser = await this.usersService.createTeacher(newUser)
      const department = await this.departmentService.findById(departmentId)
      const newDetailUser = {
        teacherName: name,
        teacherDepartment: department,
        teacherUsers: createUser,
      }
      await this.teachersRepository.save(newDetailUser)
    }
    return 'success'
  }
}
