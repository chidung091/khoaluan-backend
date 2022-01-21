import { Request } from 'express'
import { Users } from 'src/modules/users/entity/users.entity'
import { Role } from 'src/modules/users/users.enum'
import { UserAuth } from '../entity/user.entity'
interface RequestWithUser extends Request {
  user: Users
  token: string
  role: Role
}
export default RequestWithUser
