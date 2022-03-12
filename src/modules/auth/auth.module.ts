import { forwardRef, Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UsersModule } from '../users/users.module'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import {
  BE_AUTH_SERVICE,
  JWT_EXPIRATION_TIME,
  JWT_SECRET,
} from 'src/config/secrets'
import { JwtStrategy } from './strategy/jwt.strategy'
import { LocalStrategy } from './strategy/local.strategy'
import { DetailUsersModule } from '../detail-users/detail-users.module'
import { TeachersModule } from '../teachers/teachers.module'
import { ClientsModule, Transport } from '@nestjs/microservices'

@Module({
  imports: [
    forwardRef(() => UsersModule),
    DetailUsersModule,
    TeachersModule,
    PassportModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: {
        expiresIn: JWT_EXPIRATION_TIME,
      },
    }),
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
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
