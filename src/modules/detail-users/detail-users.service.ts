import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateDetailUsersDto } from './dto/detail-users.dto'
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
}
