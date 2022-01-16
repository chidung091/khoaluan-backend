import { Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'

@Injectable()
export class CommonService {
  constructor(private readonly usersService: UsersService) {}

  public async createResetPassword(email: string) {
    const data = await this.usersService.createResetPassword(email)
    console.log(data)
    return 'Created'
  }

  public async resetPassword(newPassword: string, token: string) {
    const data = await this.usersService.resetPassword(newPassword, token)
    console.log(data)
    return 'Reseted'
  }
}
