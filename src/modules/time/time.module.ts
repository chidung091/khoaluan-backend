import { Module } from '@nestjs/common'
import { TimeService } from './time.service'
import { TimeController } from './time.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Time } from './time.entity'
import { UsersModule } from '../users/users.module'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { BE_AUTH_SERVICE } from 'src/config/secrets'

@Module({
  imports: [
    TypeOrmModule.forFeature([Time]),
    UsersModule,
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
  providers: [TimeService],
  controllers: [TimeController],
})
export class TimeModule {}
