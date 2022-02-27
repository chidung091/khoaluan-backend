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
import { BE2_SERVICE } from 'src/config/secrets'

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
    ]),
    TypeOrmModule.forFeature([Class]),
    HttpModule,
    forwardRef(() => UsersModule),
    forwardRef(() => DepartmentModule),
    CourseModule,
    forwardRef(() => TeachersModule),
  ],
  providers: [ClassService],
  controllers: [ClassController],
  exports: [ClassService],
})
export class ClassModule {}
