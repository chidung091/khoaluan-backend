import { Injectable } from '@nestjs/common'
import { Role } from '../users/users.enum'
import { UsersService } from '../users/users.service'

@Injectable()
export class AdminService {
  constructor(private readonly usersService: UsersService) {}

  public async getUserByRole(role: Role) {
    return this.usersService.getListByRole(role)
  }
}
