import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ClassService } from './class.service'
import { Class } from './entity/class.entity'
import { ClassController } from './class.controller'
import { HttpModule } from '@nestjs/axios'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [TypeOrmModule.forFeature([Class]), HttpModule, UsersModule],
  providers: [ClassService],
  controllers: [ClassController],
})
export class ClassModule {}
