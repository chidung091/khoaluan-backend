import { Role } from 'src/modules/users/users.enum'

export interface UserAuth {
  id: number
  role: Role
}
