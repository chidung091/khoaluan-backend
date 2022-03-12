import { JwtPayload } from 'jsonwebtoken'

export interface IJwtPayload extends JwtPayload {
  userID: number
  name: string
  role: string
}
