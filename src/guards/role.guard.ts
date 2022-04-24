import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { isEmpty } from 'lodash'
import { Observable } from 'rxjs'
import { ROLES_KEY } from 'src/decorators/roles.decorator'
import { Role } from 'src/modules/users/users.enum'

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const targets = [context.getHandler(), context.getClass()]
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      targets,
    )
    if (!requiredRoles || isEmpty(requiredRoles)) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    if (!requiredRoles.includes(request.user.role)) {
      throw new ForbiddenException()
    }

    return true
  }
}
