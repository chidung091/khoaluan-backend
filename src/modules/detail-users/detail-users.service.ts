import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DetailUsers } from './entity/detail-users.entity'

@Injectable()
export class DetailUsersService {
  constructor(
    @InjectRepository(DetailUsers)
    private detailUsersRepository: Repository<DetailUsers>,
  ) {}

  public async findById(id: number): Promise<DetailUsers> {
    return this.detailUsersRepository
      .createQueryBuilder('detail_users')
      .leftJoinAndSelect('detail_users.users', 'userID')
      .where('detail_users.usersUserID = :id', { id: id })
      .getOne()
  }
}
