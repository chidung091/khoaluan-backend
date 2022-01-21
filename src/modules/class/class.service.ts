import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Class } from './entity/class.entity'

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private detailUsersRepository: Repository<Class>,
  ) {}
}
