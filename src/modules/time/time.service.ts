import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateTimeDto } from './dto/create-time.dto'
import { UpdateTime } from './dto/update-time.dto'
import { Time } from './time.entity'
import { Status } from './time.enum'

@Injectable()
export class TimeService {
  constructor(
    @InjectRepository(Time)
    private timeRepository: Repository<Time>,
  ) {}

  public async create(time: CreateTimeDto) {
    const timeCreate = {
      ...time,
      status: Status.Inactive,
    }
    return this.timeRepository.save(timeCreate)
  }

  public async findById(id: number): Promise<Time> {
    return this.timeRepository.findOne(id)
  }
  public async get(): Promise<Time[]> {
    return this.timeRepository.find()
  }

  public async changeToInactive(id: number) {
    const existing = await this.timeRepository.findOne(id)
    const timeUpdate = existing
    timeUpdate.status = Status.Inactive
    return this.timeRepository.save({
      ...existing,
      ...timeUpdate,
    })
  }
  public async changeStatus(id: number): Promise<Time> {
    const findActive = await this.timeRepository.find({ status: Status.Active })
    if (findActive) {
      await Promise.all(
        findActive.map(async (arrayItem) => {
          await this.changeToInactive(arrayItem.id)
        }),
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

  public async update(id: number, time: UpdateTime): Promise<Time> {
    const existing = await this.timeRepository.findOne({ id: id })
    const timeUpdate = {
      ...time,
    }
    console.log('hien tai', existing)
    console.log('dto', time)
    console.log(timeUpdate)
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
