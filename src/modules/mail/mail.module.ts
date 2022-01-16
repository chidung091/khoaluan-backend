import { Module } from '@nestjs/common'
import { MailService } from './mail.service'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { MailerModule } from '@nestjs-modules/mailer'
import { join } from 'path'
import { EMAIL_NAME, EMAIL_PASSWORD } from 'src/config/secrets'

@Module({
  imports: [
    MailerModule.forRoot({
      // transport: 'smtps://user@example.com:topsecret@smtp.example.com',
      // or
      transport: {
        host: 'smtp.gmail.com',
        secure: true,
        auth: {
          type: 'login', // default
          user: EMAIL_NAME,
          pass: EMAIL_PASSWORD,
        },
      },
      defaults: {
        from: '"Quản Lý Điểm Rèn Luyện" <lth.khoaluan@gmail.com>',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService], // 👈 export for DI
})
export class MailModule {}
