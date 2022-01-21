import { Role } from 'src/modules/users/users.enum'

export interface TokenPayload {
  userId: number
  role: Role
  name: string
}
