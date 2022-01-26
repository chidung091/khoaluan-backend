import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateTimeDto } from './dto/create-time.dto'
import { TimeDto } from './dto/time.dto'
import { Time } from './time.entity'
import { Status } from './time.enum'

@Injectable()
export class TimeService {
  constructor(
    @InjectRepository(Time)
    private timeRepository: Repository<Time>,
  ) {}

  public async create(time: CreateTimeDto) {
    return this.timeRepository.save(time)
  }

  public async findById(id: number): Promise<Time> {
    return this.timeRepository.findOne(id)
  }
  public async get(): Promise<Time[]> {
    return this.timeRepository.find()
  }

  public async changeStatus(id: number): Promise<Time> {
    const findActive = await this.timeRepository.find({ status: Status.Active })
    if (findActive) {
      throw new BadRequestException(
        'Please inactive the time have active status to continue',
      )
    }
    const existing = await this.timeRepository.findOne(id)
    if (!existing) {
      throw new NotFoundException('NOT_FOUND_THIS_TIME')
    }
    const timeUpdate = existing
    if (existing.status === Status.Inactive) {
      timeUpdate.status = Status.Active
      return this.timeRepository.save({
        ...existing,
        ...timeUpdate,
      })
    }
    timeUpdate.status = Status.Inactive
    return this.timeRepository.save({
      ...existing,
      ...timeUpdate,
    })
  }

  public async update(id: number, time: TimeDto): Promise<Time> {
    const existing = await this.timeRepository.findOne({ id: id })
    const timeUpdate = {
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

  public async delete(id: number): Promise<Time> {
    const existing = await this.timeRepository.findOne({ id: id })
    if (!existing) {
      throw new NotFoundException('NOT FOUND ID')
    }
    return this.timeRepository.remove(existing)
  }
}
