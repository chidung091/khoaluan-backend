import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CourseService } from './course.service'
import { Course } from './entity/course.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Course])],
  providers: [CourseService],
})
export class CourseModule {}
