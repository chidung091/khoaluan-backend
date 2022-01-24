import { forwardRef, Module } from '@nestjs/common'
import { DetailUsersService } from './detail-users.service'
import { DetailUsersController } from './detail-users.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DetailUsers } from './entity/detail-users.entity'
import { HttpModule } from '@nestjs/axios'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([DetailUsers]),
    HttpModule,
    forwardRef(() => UsersModule),
  ],
  providers: [DetailUsersService],
  controllers: [DetailUsersController],
  exports: [DetailUsersService],
})
export class DetailUsersModule {}
