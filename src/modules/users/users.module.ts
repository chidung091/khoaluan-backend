import { forwardRef, Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Users } from './entity/users.entity'
import { ResetPassword } from './entity/reset-password.entity'
import { MailModule } from '../mail/mail.module'
import { DetailUsersModule } from '../detail-users/detail-users.module'
import { AuthModule } from '../auth/auth.module'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { BE_AUTH_SERVICE } from 'src/config/secrets'

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    TypeOrmModule.forFeature([ResetPassword]),
    forwardRef(() => AuthModule),
    MailModule,
    DetailUsersModule,
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
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
