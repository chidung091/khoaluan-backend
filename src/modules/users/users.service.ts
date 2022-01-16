import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { CreateUsersDto } from './dto/create-users.dto'
import { Users } from './entity/users.entity'
import { Role, Status } from './users.enum'
import { ResetPassword } from './entity/reset-password.entity'
import * as uuid from 'uuid'
import { MailService } from '../mail/mail.service'
import { DetailUsersService } from '../detail-users/detail-users.service'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(ResetPassword)
    private resetPasswordRepository: Repository<ResetPassword>,
    private mailService: MailService,
    private detailUsersService: DetailUsersService,
  ) {}

  public async createUser(dto: CreateUsersDto): Promise<Users> {
    const users = {
      ...dto,
      role: Role.Student,
    }
    return this.usersRepository.save(users)
  }

  public async getById(id: number) {
    const user = await this.usersRepository.findOne(id)
    if (user) {
      return user
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    )
  }

  public async getByEmail(email: string) {
    const user = await this.usersRepository.findOne({ email: email })
    if (user) {
      return user
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    )
  }

  public async getListByRole(role: Role) {
    const users = await this.usersRepository.find({ role: role })
    return users
  }

  public async getRole(id: string) {
    const user = await this.usersRepository.findOne(id)
    if (user) {
      return user.role
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    )
  }

  public async changePassword(id: number, oldPassword, newPassword) {
    const user = await this.usersRepository.findOne(id)
    if (!user) {
      throw new NotFoundException('User not found')
    }
    try {
      await this.verifyPassword(oldPassword, user.password)
      const user2: Users = user
      const hashedNewPassword = await bcrypt.hash(newPassword, 10)
      user2.password = hashedNewPassword
      return this.usersRepository.save({
        ...user, // existing fields
        ...user2, // updated fields
      })
    } catch (error) {
      throw new HttpException(
        'Wrong password credentails',
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

  public async createResetPassword(email: string) {
    const data = await this.getByEmail(email)
    if (!data) {
      throw new NotFoundException('NOT_FOUND_EMAIL')
    }
    // const MoreThanDate = (date: Date) =>
    //   MoreThan(format(date, 'yyyy-MM-dd HH:MM:SS'))
    await this.resetPasswordRepository
      .createQueryBuilder()
      .delete()
      .where('email = :email', { email: email })
      .execute()
    const token: string = uuid.v4()
    const expiredDate = new Date(new Date().setHours(new Date().getHours() + 2))
    const createChangePassword = {
      token: token,
      expiredAt: expiredDate,
      userID: data.userID,
      email: data.email,
      status: Status.Starting,
    }
    const dataDetailUsers = await this.detailUsersService.findById(data.userID)
    await this.mailService.sendResetPassword(dataDetailUsers, token)
    return this.resetPasswordRepository.save(createChangePassword)
  }

  public async resetPassword(newPassword: string, token: string) {
    const findToken = await this.resetPasswordRepository.findOne({
      token: token,
    })
    if (!findToken) {
      throw new NotFoundException('Cannot found your token')
    }
    if (findToken.status === Status.Changed) {
      throw new BadRequestException('Your password has changed')
    }
    if (findToken.expiredAt < new Date()) {
      throw new BadRequestException('Your token expired')
    }
    const data = await this.usersRepository.findOne(findToken.userID)
    if (!data) {
      throw new NotFoundException('User not found')
    }
    const dataNew = data
    dataNew.password = await bcrypt.hash(newPassword, 10)
    await this.resetPasswordRepository.delete({ id: findToken.id })
    return this.usersRepository.save({
      ...data,
      ...dataNew,
    })
  }
}
