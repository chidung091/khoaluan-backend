import { Module } from '@nestjs/common'
import { AdminService } from './admin.service'
import { AdminController } from './admin.controller'
import { UsersModule } from '../users/users.module'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { BE2_SERVICE, BE_AUTH_SERVICE } from 'src/config/secrets'
import { ClassModule } from '../class/class.module'
import { TeachersModule } from '../teachers/teachers.module'

@Module({
  imports: [
    UsersModule,
    ClassModule,
    TeachersModule,
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
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
