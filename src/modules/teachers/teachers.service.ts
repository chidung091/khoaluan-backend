import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Teachers } from './entity/teachers.entity'

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teachers)
    private teachersRepository: Repository<Teachers>,
  ) {}

  public async findById(id: number): Promise<Teachers> {
    return this.teachersRepository
      .createQueryBuilder('teachers')
      .leftJoinAndSelect('teachers.teacherUsers', 'userID')
      .where('teachers.teacherUsersUserID = :id', { id: id })
      .getOne()
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
}
