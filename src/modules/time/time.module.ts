import { Module } from '@nestjs/common'
import { TimeService } from './time.service'
import { TimeController } from './time.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Time } from './time.entity'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [TypeOrmModule.forFeature([Time]), UsersModule],
  providers: [TimeService],
  controllers: [TimeController],
})
export class TimeModule {}
