import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreatePointFrameDto } from './dto/point-frame.dto'
import { PointFrame } from './point-frame.entity'

@Injectable()
export class PointFrameService {
  constructor(
    @InjectRepository(PointFrame)
    private pointFrameRepository: Repository<PointFrame>,
  ) {}

  public async create(dto: CreatePointFrameDto) {
    return this.pointFrameRepository.save(dto)
  }

  public async findById(id: number): Promise<PointFrame> {
    return this.pointFrameRepository.findOne(id)
  }

  public async get(): Promise<PointFrame[]> {
    return this.pointFrameRepository.find()
  }

  public async update(
    id: number,
    time: CreatePointFrameDto,
  ): Promise<PointFrame> {
    const existing = await this.pointFrameRepository.findOne({ id: id })
    const timeUpdate = {
      ...time,
    }
    if (!existing) {
      throw new NotFoundException('NOT FOUND ID')
    }
    return this.pointFrameRepository.save({
      ...existing, // existing fields
      ...timeUpdate, // updated fields
    })
  }

  public async delete(id: number): Promise<PointFrame> {
    const existing = await this.pointFrameRepository.findOne({ id: id })
    if (!existing) {
      throw new NotFoundException('NOT FOUND ID')
    }
    return this.pointFrameRepository.remove(existing)
  }
}
