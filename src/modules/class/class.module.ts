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
import { ClientsModule, Transport } from '@nestjs/microservices'
import { BE2_SERVICE, BE_AUTH_SERVICE } from 'src/config/secrets'
import { TimeModule } from '../time/time.module'
import { DetailUsersModule } from '../detail-users/detail-users.module'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RATING_SERVICE',
        transport: Transport.TCP,
        options: {
          host: BE2_SERVICE,
          port: 4004,
        },
      },
      {
        name: 'AUTH_CLIENT',
        transport: Transport.TCP,
        options: {
          host: BE_AUTH_SERVICE,
          port: 4002,
        },
      },
    ]),
    TypeOrmModule.forFeature([Class]),
    HttpModule,
    forwardRef(() => UsersModule),
    forwardRef(() => DetailUsersModule),
    forwardRef(() => DepartmentModule),
    forwardRef(() => TimeModule),
    CourseModule,
    forwardRef(() => TeachersModule),
  ],
  providers: [ClassService],
  controllers: [ClassController],
  exports: [ClassService],
})
export class ClassModule {}
