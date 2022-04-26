import { forwardRef, Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BE_AUTH_SERVICE } from 'src/config/secrets'
import { ClassModule } from '../class/class.module'
import { DetailUsersModule } from '../detail-users/detail-users.module'
import { TimeModule } from '../time/time.module'
import { UsersModule } from '../users/users.module'
import { MarkDetail } from './entity/mark-detail.entity'
import { Mark } from './entity/mark.entity'
import { MarkController } from './mark.controller'
import { MarkService } from './mark.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Mark]),
    TypeOrmModule.forFeature([MarkDetail]),
    forwardRef(() => DetailUsersModule),
    forwardRef(() => UsersModule),
    forwardRef(() => ClassModule),
    forwardRef(() => TimeModule),
    ClientsModule.register([
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
  controllers: [MarkController],
  providers: [MarkService],
})
export class MarkModule {}
