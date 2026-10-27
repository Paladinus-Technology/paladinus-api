import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { invitedEmail } from './templates/invited.template';
import { SendCodeEmail } from './templates/send-code-login.template';
import { welcomeTemplate } from './templates/welcome.template';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(to: string, name: string) {
    try {
      return this.mailerService.sendMail({
        to,
        subject: '🎉 Bem-vindo à plataforma!',
        html: welcomeTemplate(name),
        text: `Olá ${name}, Seja bem-vindo à nossa plataforma! Se tiver dúvidas, estamos à disposição. Abraços, Equipe de Suporte.`,
      });
    } catch (error) {
      Logger.log(error);
    }
  }

  async inviteEmail(to: string, token: string, origin: string) {
    try {
      return this.mailerService.sendMail({
        to,
        subject: 'Acesso à plataforma corporativa da Paladinus SE',
        html: invitedEmail(token, origin),
      });
    } catch (error) {
      Logger.log(error);
    }
  }

  async sendCodeEmail(to: string, code: string) {
    try {
      return this.mailerService.sendMail({
        to,
        subject: 'Código de verificação',
        html: SendCodeEmail(code),
      });
    } catch (error) {
      Logger.log(error);
    }
  }
}
