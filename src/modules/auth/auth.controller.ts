import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateUsersDto } from '../users/dto/create-users.dto'
import { AuthService } from './auth.service'
import { AuthDto } from './dto/auth.dto'
import RequestWithUser from './dto/requestWithUser.dto'
import { ResponseAuthDto } from './dto/responseAuth.dto'
import { LocalAuthenticationGuard } from './guard/localAuthentication.guard'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Create new users' })
  @ApiResponse({ status: 201, description: 'Success', type: CreateUsersDto })
  async registerUser(@Body() usersDTO: CreateUsersDto) {
    return this.authService.register(usersDTO)
  }

  @Post('/login')
  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: AuthDto })
  async logIn(@Req() req: RequestWithUser) {
    const name = await this.authService.getName(req.user.userID, req.user.role)
    const user: ResponseAuthDto = {
      id: req.user.userID,
      token: this.authService.getJWTToken(req.user.userID, req.user.role, name),
      role: req.user.role,
    }
    return user
  }
}
