import { MailerService } from '@nestjs-modules/mailer';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { invitedEmail } from './templates/invited.template';
import { SendCodeEmail } from './templates/send-code-login.template';
import { welcomeTemplate } from './templates/welcome.template';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to,
        subject: '🎉 Bem-vindo à plataforma!',
        html: welcomeTemplate(name),
        text: `Olá ${name}, Seja bem-vindo à nossa plataforma! Se tiver dúvidas, estamos à disposição. Abraços, Equipe de Suporte.`,
      });
      this.logger.log(`E-mail de boas-vindas enviado com sucesso para: ${to}`);
    } catch (err) {
      const errMessage =
        err instanceof Error ? err.message : 'Erro desconhecido';
      this.logger.error(
        `Falha ao enviar e-mail de boas-vindas para ${to}:`,
        errMessage,
      );
      throw new InternalServerErrorException(
        'Erro ao enviar e-mail de boas-vindas.',
      );
    }
  }

  async inviteEmail(to: string, token: string, origin: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Acesso à plataforma corporativa da Paladinus SE',
        html: invitedEmail(token, origin),
      });
      this.logger.log(`E-mail de convite enviado com sucesso para: ${to}`);
    } catch (err) {
      const errMessage =
        err instanceof Error ? err.message : 'Erro desconhecido';
      this.logger.error(
        `Falha ao enviar e-mail de convite para ${to}:`,
        errMessage,
      );
      throw new InternalServerErrorException(
        'Erro ao enviar e-mail de convite.',
      );
    }
  }

  async sendCodeEmail(to: string, code: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Código de verificação',
        html: SendCodeEmail(code),
      });
      this.logger.log(`Código de verificação enviado com sucesso para: ${to}`);
    } catch (err) {
      const errMessage =
        err instanceof Error ? err.message : 'Erro desconhecido';
      this.logger.error(
        `Falha ao enviar código de verificação para ${to}:`,
        errMessage,
      );

      throw new InternalServerErrorException(
        'Não foi possível enviar o código de verificação por e-mail.',
      );
    }
  }
}
