import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, UserRole } from 'generated/prisma';
import { EmailService } from 'src/common/email/email.service';
import { JwtTokenService } from 'src/common/jwt-token/jwt-token.service';
import { comparePassword, hashPassword } from 'src/common/utils/hash';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { MasterCreateDto } from './dto/master-register.dto';
import { JwtPayload } from './jwt/jwt.payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtTokenService,
    private readonly email: EmailService,
  ) {}

  private getUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async signIn(loginAuthDto: LoginAuthDto) {
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

    const { access_token, refresh_token } = this.jwt.sing(payload);

    return { access_token, refresh_token };
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
              emails: { set: [masterCreatedDto.email] },
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

  // findAll() {
  //   return `This action returns all auth`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}
