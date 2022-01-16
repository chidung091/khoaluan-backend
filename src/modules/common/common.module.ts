import { Module } from '@nestjs/common'
import { CommonService } from './common.service'
import { CommonController } from './common.controller'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [UsersModule],
  providers: [CommonService],
  controllers: [CommonController],
})
export class CommonModule {}
