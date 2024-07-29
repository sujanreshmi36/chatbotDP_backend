import { MailerModule } from '@nestjs-modules/mailer';
import * as dotenv from 'dotenv';
dotenv.config();

export const mailerConfig = MailerModule.forRoot({
  transport: {
    service: 'gmail',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EmailUser,
      pass: process.env.Password,
    },
  }
});
