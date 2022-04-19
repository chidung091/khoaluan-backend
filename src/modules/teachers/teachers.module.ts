import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Teachers } from './entity/teachers.entity'
import { TeachersService } from './teachers.service'
import { TeachersController } from './teachers.controller'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { BE_AUTH_SERVICE } from 'src/config/secrets'
import { UsersModule } from '../users/users.module'
import { DepartmentModule } from '../department/department.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Teachers]),
    forwardRef(() => UsersModule),
    forwardRef(() => DepartmentModule),
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
  providers: [TeachersService],
  exports: [TeachersService],
  controllers: [TeachersController],
})
export class TeachersModule {}
