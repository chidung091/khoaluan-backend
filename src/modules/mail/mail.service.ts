import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { DetailUsers } from '../detail-users/entity/detail-users.entity'
@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendResetPassword(user: DetailUsers, token: string) {
    const url = `http://localhost:8080/reset/${token}`

    await this.mailerService.sendMail({
      to: user.users.email,
      subject: 'Tìm mật khẩu',
      template: '.template/confirmation', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: user.name,
        url,
      },
    })
  }
}
