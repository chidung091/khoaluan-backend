import { forwardRef, Module } from '@nestjs/common'
import { DetailUsersService } from './detail-users.service'
import { DetailUsersController } from './detail-users.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DetailUsers } from './entity/detail-users.entity'
import { HttpModule } from '@nestjs/axios'
import { UsersModule } from '../users/users.module'
import { ClassModule } from '../class/class.module'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { BE2_SERVICE, BE_AUTH_SERVICE } from 'src/config/secrets'
import { TimeModule } from '../time/time.module'
import { Mark } from '../mark/entity/mark.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([DetailUsers]),
    HttpModule,
    forwardRef(() => ClassModule),
    forwardRef(() => UsersModule),
    forwardRef(() => TimeModule),
    forwardRef(() => UsersModule),
    forwardRef(() => Mark),
    ClientsModule.register([
      {
        name: 'RATING_SERVICE',
        transport: Transport.TCP,
        options: {
          host: BE2_SERVICE,
          port: 4004,
        },
      },
      {
        name: 'AUTH_CLIENT',
        transport: Transport.TCP,
        options: {
          host: BE_AUTH_SERVICE,
          port: 4002,
        },
      },
    ]),
  ],
  providers: [DetailUsersService],
  controllers: [DetailUsersController],
  exports: [DetailUsersService],
})
export class DetailUsersModule {}
