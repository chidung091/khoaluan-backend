import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Users } from './entity/users.entity'
import { ResetPassword } from './entity/reset-password.entity'
import { MailModule } from '../mail/mail.module'
import { DetailUsersModule } from '../detail-users/detail-users.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    TypeOrmModule.forFeature([ResetPassword]),
    MailModule,
    DetailUsersModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
