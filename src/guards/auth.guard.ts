import { CanActivate, Inject, ExecutionContext, Logger } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'

export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_CLIENT')
    private readonly client: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    try {
      const jwt = req.headers['authorization']?.split(' ')[1]
      const res = await firstValueFrom(
        this.client.send({ role: 'auth', cmd: 'check' }, jwt),
      )
      return res
    } catch (err) {
      Logger.error(err)
      return false
    }
  }
}
