import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ClassService } from './class.service'
import { Class } from './entity/class.entity'
import { ClassController } from './class.controller'
import { HttpModule } from '@nestjs/axios'
import { UsersModule } from '../users/users.module'
import { DepartmentModule } from '../department/department.module'
import { CourseModule } from '../course/course.module'
import { TeachersModule } from '../teachers/teachers.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Class]),
    HttpModule,
    forwardRef(() => UsersModule),
    forwardRef(() => DepartmentModule),
    CourseModule,
    TeachersModule,
  ],
  providers: [ClassService],
  controllers: [ClassController],
  exports: [ClassService],
})
export class ClassModule {}
