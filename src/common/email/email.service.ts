import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { invitedEmail } from './templates/invited.template';
import { SendCodeEmail } from './templates/send-code-login.template';
import { welcomeTemplate } from './templates/welcome.template';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {
    const apiKeyResend = this.configService.get<string>('RESEND_API_KEY');
    this.resend = new Resend(apiKeyResend);
  }

  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    try {
      await this.resend.emails.send({
        from: this.configService.get<string>('EMAIL_FROM')!,
        to,
        subject: '🎉 Bem-vindo à plataforma!',
        html: welcomeTemplate(name),
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
      await this.resend.emails.send({
        from: this.configService.get<string>('EMAIL_FROM')!,
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
      await this.resend.emails.send({
        from: this.configService.get<string>('EMAIL_FROM')!,
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
