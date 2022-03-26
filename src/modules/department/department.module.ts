import { forwardRef, Module } from '@nestjs/common'
import { DepartmentService } from './department.service'
import { DepartmentController } from './department.controller'
import { Department } from './entity/department.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from '../users/users.module'
import { TeachersModule } from '../teachers/teachers.module'
import { ClassModule } from '../class/class.module'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { BE_AUTH_SERVICE } from 'src/config/secrets'

@Module({
  imports: [
    TypeOrmModule.forFeature([Department]),
    forwardRef(() => UsersModule),
    forwardRef(() => TeachersModule),
    forwardRef(() => ClassModule),
    ClientsModule.register([
      {
        name: 'AUTH_CLIENT',
        transport: Transport.TCP,
        options: {
          host: BE_AUTH_SERVICE,
          port: 4002,
        },
      },
    ]),
  ],
  providers: [DepartmentService],
  controllers: [DepartmentController],
  exports: [DepartmentService],
})
export class DepartmentModule {}
