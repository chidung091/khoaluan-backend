import { Module } from '@nestjs/common'
import { DepartmentService } from './department.service'
import { DepartmentController } from './department.controller'
import { Department } from './entity/department.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [TypeOrmModule.forFeature([Department]), UsersModule],
  providers: [DepartmentService],
  controllers: [DepartmentController],
})
export class DepartmentModule {}
