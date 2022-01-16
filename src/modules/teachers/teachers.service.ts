import { Injectable } from '@nestjs/common'
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
}
