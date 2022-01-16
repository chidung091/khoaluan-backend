import { Module } from '@nestjs/common'
import { DetailUsersService } from './detail-users.service'
import { DetailUsersController } from './detail-users.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DetailUsers } from './entity/detail-users.entity'
import { MailModule } from '../mail/mail.module'

@Module({
  imports: [TypeOrmModule.forFeature([DetailUsers]), MailModule],
  providers: [DetailUsersService],
  controllers: [DetailUsersController],
  exports: [DetailUsersService],
})
export class DetailUsersModule {}
