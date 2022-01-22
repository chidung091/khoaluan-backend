import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Course } from './entity/course.entity'

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  public async findAll() {
    return this.courseRepository.find()
  }

  public async findName(id: number) {
    const data = await this.courseRepository.findOne({ courseId: id })
    if (!data) {
      throw new NotFoundException('NOT_FOUND_COURSE')
    }
    return data
  }
}
