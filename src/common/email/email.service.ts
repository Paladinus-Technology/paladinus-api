import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { invitedEmail } from './templates/invited.template';
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

  async inviteEmail(to: string, token: string) {
    try {
      return this.mailerService.sendMail({
        to,
        subject: 'Acesso à plataforma corporativa da Paladinus SE',
        html: invitedEmail(token),
      });
    } catch (error) {
      Logger.log(error);
    }
  }
}
