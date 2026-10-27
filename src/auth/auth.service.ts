import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, UserRole } from 'generated/prisma';
import { EmailService } from 'src/common/email/email.service';
import { EmailPayload } from 'src/common/interfaces/EmailPayload';
import { JwtTokenService } from 'src/common/jwt-token/jwt-token.service';
import { generateEmailVerificationCode } from 'src/common/utils/email-verification-code.util';
import { comparePassword, hashPassword } from 'src/common/utils/hash';
import { TokenService } from 'src/modules/token/token.service';
import { PrismaService } from '../prisma/prisma.service';
import { ClientCreateDto } from './dto/client-tegister.dto';
import { EmailLoginDto } from './dto/email-login.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { MasterCreateDto } from './dto/master-register.dto';
import { JwtPayload } from './jwt/jwt.payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtTokenService,
    private readonly email: EmailService,
    private readonly tokenService: TokenService,
  ) {}

  private getUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
  private getCompanyById(id: string) {
    return this.prisma.company.findUnique({
      where: { id },
      include: { users: true },
    });
  }

  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.getUserByEmail(loginAuthDto.email);

    if (!user) {
      throw new UnauthorizedException('Email or password incorrect!');
    }

    const isMatch = await comparePassword(loginAuthDto.password, user.password);
    if (!isMatch)
      throw new UnauthorizedException('Email or password incorrect!');

    const payload: JwtPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const { access_token } = this.jwt.singAuth(payload);

    return { access_token };
  }

  async requestCodeLogin(email: EmailLoginDto) {
    const user = await this.getUserByEmail(email.email);

    if (!user) {
      throw new UnauthorizedException('Email not found!');
    }
    const code = generateEmailVerificationCode();
    await this.tokenService.createToken(code, email.email);
    await this.email.sendCodeEmail(email.email, code);
    return { message: 'Verification code sent to email.' };
  }

  async verifyCode(email: string, code: number) {
    const codeInBank = await this.prisma.token.findUnique({
      where: { email },
    });

    if (!codeInBank || Number(codeInBank.token) !== code) {
      throw new UnauthorizedException('Invalid verification code!');
    }

    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid verification code!');
    }
    const payload: JwtPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const { access_token } = this.jwt.singAuth(payload);

    return { access_token };
  }
  async createMaster(masterCreatedDto: MasterCreateDto) {
    const user = await this.getUserByEmail(masterCreatedDto.email);
    if (user) {
      throw new BadRequestException('A User with this email already exists');
    }

    const hashedPassword = await hashPassword(masterCreatedDto.password);

    try {
      const userCreate = await this.prisma.user.create({
        data: {
          name: masterCreatedDto.name,
          email: masterCreatedDto.email,
          password: hashedPassword,
          role: UserRole.MASTER,
          company: {
            create: {
              name: 'Paladinus SE',
              cnpj: '47.161.953/0001-03',
              emails: {
                create: [{ email: masterCreatedDto.email }],
              },
              location: 'Joao Pessoa / PB',
            },
          },
        },
      });

      this.email.sendWelcomeEmail(userCreate.email, userCreate.name);

      return `${userCreate.name} Criado com sucesso !!`;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        console.error('[Erro conhecido do Prisma]', err.message);
      } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        console.error('[Erro desconhecido do Prisma]', err);
      } else {
        console.error('[Erro geral]', err);
      }
      throw new BadRequestException('Erro ao criar usuário/master');
    }
  }

  async createClient(emailToken: EmailPayload, clientDTO: ClientCreateDto) {
    const user = await this.getUserByEmail(emailToken.email);
    if (user)
      throw new BadRequestException('A User with this email already exists');

    console.log(emailToken);
    const company = await this.getCompanyById(emailToken.companyId);
    if (!company) throw new BadRequestException('A Company is required!');

    const hashedPassword = await hashPassword(clientDTO.password);

    try {
      const clientCreate = await this.prisma.user.create({
        data: {
          name: clientDTO.name,
          email: emailToken.email,
          password: hashedPassword,
          role: emailToken.role as UserRole,
          companyId: emailToken.companyId,
        },
      });

      await this.prisma.company.update({
        where: { id: emailToken.companyId },
        data: {
          emails: {
            create: [{ email: emailToken.email }],
          },
        },
      });

      return `${clientCreate.name} Criado com sucesso !!`;
    } catch (err) {
      Logger.error('Erro ao criar cliente:', err);
      throw new InternalServerErrorException(
        'Não foi possível criar o cliente.',
      );
    }
  }
}
