import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Prisma, UserRole } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { MasterCreateDto } from './dto/master-register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
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
    const isMatch = await bcrypt.compare(loginAuthDto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Email or password incorrect!');

    const payload = { id: user.id, name: user.name, email: user.email, role: user.role };
    const access_token = this.jwt.sign(payload, { expiresIn: '15m' });
    const refresh_token = this.jwt.sign({ id: user.id, role: user.role }, { expiresIn: '7d' });

    return { access_token, refresh_token };
  }

  async createMaster(masterCreatedDto: MasterCreateDto) {
    const user = await this.getUserByEmail(masterCreatedDto.email);
    if (user) {
      throw new BadRequestException('A User with this email already exists');
    }

    const hashPassword = await bcrypt.hash(masterCreatedDto.password, 10);

    try {
      const userCreate = await this.prisma.user.create({
        data: {
          name: masterCreatedDto.name,
          email: masterCreatedDto.email,
          password: hashPassword,
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
