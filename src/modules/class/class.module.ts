import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ClassService } from './class.service'
import { Class } from './entity/class.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Class])],
  providers: [ClassService],
})
export class ClassModule {}
