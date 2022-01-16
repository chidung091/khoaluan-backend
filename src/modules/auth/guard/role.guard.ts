import {
  CanActivate,
  ExecutionContext,
  Inject,
  mixin,
  Type,
} from '@nestjs/common'
import { Role } from 'src/modules/users/users.enum'
import { UsersService } from 'src/modules/users/users.service'
import RequestWithUser from '../dto/requestWithUser.dto'

const RoleGuard = (role: Role): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    constructor(@Inject(UsersService) private usersService: UsersService) {}

    async canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<RequestWithUser>()
      const user = {
        ...request.user,
        role: await this.usersService.getRole(request.user.email),
      }
      return user?.role.includes(role)
    }
  }

  return mixin(RoleGuardMixin)
}

export default RoleGuard
