import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Teachers } from './entity/teachers.entity'
import { TeachersService } from './teachers.service'

@Module({
  imports: [TypeOrmModule.forFeature([Teachers])],
  providers: [TeachersService],
  exports: [TeachersService],
})
export class TeachersModule {}
