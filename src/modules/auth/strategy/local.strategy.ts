import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { Users } from 'src/modules/users/entity/users.entity'
import { AuthService } from '../auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthService) {
    super({
      usernameField: 'id',
    })
  }
  async validate(id: string, password: string): Promise<Users> {
    if (this.validateEmail(id)) {
      return this.authenticationService.loginEm(id, password)
    } else {
      return this.authenticationService.login(parseInt(id), password)
    }
  }

  validateEmail(email: string) {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    )
  }
}
