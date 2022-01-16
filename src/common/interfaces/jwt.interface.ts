import { JwtPayload } from 'jsonwebtoken';

export interface IJwtPayload extends JwtPayload {
  'cognito:groups': string[];
  email_verified: boolean;
  'cognito:username': string;
  'cognito:roles': string[];
  event_id: string;
  token_use: string;
  auth_time: number;
  name: string;
  email: string;
}
