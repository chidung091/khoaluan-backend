import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './modules/users/users.module'
import { TimeModule } from './modules/time/time.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
  MYSQL_DATABASE,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_ROOT_PASSWORD,
  MYSQL_ROOT_USER,
} from './config/secrets'
import { AuthModule } from './modules/auth/auth.module'
import { DetailUsersModule } from './modules/detail-users/detail-users.module'
import { MailModule } from './modules/mail/mail.module'
import { CommonModule } from './modules/common/common.module'
import { AdminModule } from './modules/admin/admin.module'
import { DepartmentModule } from './modules/department/department.module'
import { CourseModule } from './modules/course/course.module'
import { ClassModule } from './modules/class/class.module'
import { TeachersModule } from './modules/teachers/teachers.module'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: MYSQL_HOST,
      port: +MYSQL_PORT,
      username: MYSQL_ROOT_USER,
      password: MYSQL_ROOT_PASSWORD,
      database: MYSQL_DATABASE,
      entities: ['dist/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    TimeModule,
    AuthModule,
    DetailUsersModule,
    MailModule,
    CommonModule,
    AdminModule,
    DepartmentModule,
    CourseModule,
    ClassModule,
    TeachersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
