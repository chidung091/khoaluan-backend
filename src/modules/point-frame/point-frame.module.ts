import { Module } from '@nestjs/common'
import { PointFrameService } from './point-frame.service'
import { PointFrameController } from './point-frame.controller'
import { PointFrame } from './point-frame.entity'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BE_AUTH_SERVICE } from 'src/config/secrets'

@Module({
  imports: [
    TypeOrmModule.forFeature([PointFrame]),
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
  providers: [PointFrameService],
  controllers: [PointFrameController],
})
export class PointFrameModule {}
