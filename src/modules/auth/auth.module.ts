import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UsersModule } from '../users/users.module'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { JWT_EXPIRATION_TIME, JWT_SECRET } from 'src/config/secrets'
import { JwtStrategy } from './strategy/jwt.strategy'
import { LocalStrategy } from './strategy/local.strategy'
import { DetailUsersModule } from '../detail-users/detail-users.module'
import { TeachersModule } from '../teachers/teachers.module'

@Module({
  imports: [
    UsersModule,
    DetailUsersModule,
    TeachersModule,
    PassportModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: {
        expiresIn: JWT_EXPIRATION_TIME,
      },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
