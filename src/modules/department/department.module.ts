import { forwardRef, Module } from '@nestjs/common'
import { DepartmentService } from './department.service'
import { DepartmentController } from './department.controller'
import { Department } from './entity/department.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from '../users/users.module'
import { TeachersModule } from '../teachers/teachers.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Department]),
    forwardRef(() => UsersModule),
    forwardRef(() => TeachersModule),
  ],
  providers: [DepartmentService],
  controllers: [DepartmentController],
  exports: [DepartmentService],
})
export class DepartmentModule {}
