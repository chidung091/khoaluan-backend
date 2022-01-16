import { Module } from '@nestjs/common'
import { TimeService } from './time.service'
import { TimeController } from './time.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Time } from './time.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Time])],
  providers: [TimeService],
  controllers: [TimeController],
})
export class TimeModule {}
