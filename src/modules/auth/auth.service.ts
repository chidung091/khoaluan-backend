import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { DetailUsersService } from '../detail-users/detail-users.service'
import { TeachersService } from '../teachers/teachers.service'
import { CreateUsersDto } from '../users/dto/create-users.dto'
import { Role } from '../users/users.enum'
import { UsersService } from '../users/users.service'
import { TokenPayload } from './entity/tokenpayload.entity'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly detailUsersService: DetailUsersService,
    private readonly teachersService: TeachersService,
    private readonly jwtService: JwtService,
  ) {}

  public async register(registrationData: CreateUsersDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10)
    try {
      const createdUser = await this.usersService.createUser({
        ...registrationData,
        password: hashedPassword,
      })
      createdUser.password = undefined
      return createdUser
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }
  }

  public async login(id: number, plainTextPassword: string) {
    try {
      const user = await this.usersService.getById(id)
      await this.verifyPassword(plainTextPassword, user.password)
      user.password = undefined
      return user
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  public async loginEm(email: string, plainTextPassword: string) {
    try {
      const user = await this.usersService.getByEmail(email)
      await this.verifyPassword(plainTextPassword, user.password)
      user.password = undefined
      return user
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    )
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      )
    }
  }
  public async getName(id: number, role: Role) {
    if (role === Role.Student || role === Role.Monitor) {
      const data = await this.detailUsersService.findById(id)
      return data.name
    }
    if (role === Role.Teacher) {
      const data = await this.teachersService.findById(id)
      return data.teacherName
    } else {
      return role
    }
  }
  public getJWTToken(id: number, role: Role, name: string) {
    const payload: TokenPayload = { id, role, name }
    return this.jwtService.sign(payload)
  }
}
