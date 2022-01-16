import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateTimeDto } from './dto/create-time.dto'
import { TimeDto } from './dto/time.dto'
import { Time } from './time.entity'

@Injectable()
export class TimeService {
  constructor(
    @InjectRepository(Time)
    private timeRepository: Repository<Time>,
  ) {}

  public async create(time: CreateTimeDto): Promise<Time> {
    return this.timeRepository.save(time)
  }

  public async findById(id: number): Promise<Time> {
    return this.timeRepository.findOne(id)
  }
  public async get(): Promise<Time[]> {
    return this.timeRepository.find()
  }
  public async update(id: number, time: TimeDto): Promise<Time> {
    const existing = await this.timeRepository.findOne({ id: id })
    const timeUpdate: Time = {
      ...time,
    }
    if (!existing) {
      throw new NotFoundException('NOT FOUND ID')
    }
    return this.timeRepository.save({
      ...existing, // existing fields
      ...timeUpdate, // updated fields
    })
  }
}
