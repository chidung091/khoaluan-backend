import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request } from 'express'
import { IJwtPayload } from 'src/common/interfaces'
import jwt_decode from 'jwt-decode'

@Injectable()
export class UserMiddleware implements NestMiddleware {
  async use(req, res, next) {
    req.user = await this.getUserSession(req)
    next()
  }

  async getUserSession(req: Request): Promise<Partial<IJwtPayload> | null> {
    if (!req.headers['authorization']) {
      return
    }
    const token = req.headers['authorization']?.split(' ')[1]
    const b = jwt_decode(token)
    if (!token) {
      return
    }
    return b as IJwtPayload
  }
}
