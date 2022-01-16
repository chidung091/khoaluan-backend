import { Role } from 'src/modules/users/users.enum'

export interface TokenPayload {
  id: number
  role: Role
  name: string
}
