import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EmailService } from 'src/common/email/email.service';
import { TypeCode } from 'src/common/enum/type-code.enum';
import { JwtTokenService } from 'src/common/jwt-token/jwt-token.service';
import { generateCode } from 'src/common/utils/generate-code.util';
import { comparePassword } from 'src/common/utils/hash';
import { TokenService } from 'src/modules/token/token.service';
import { UserService } from 'src/modules/user/user.service';
import { EmailDto } from './dto/email.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtPayload } from './jwt/jwt.payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwt: JwtTokenService,
    private readonly email: EmailService,
    private readonly tokenService: TokenService,
  ) {}

  private getUserByEmail(email: string) {
    return this.userService.getUserByEmail(email);
  }

  // private getCompanyById(id: string) {
  //   return this.companyRepository.findOne({
  //     where: { _id: new ObjectId(id) },
  //   });
  // }

  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.getUserByEmail(loginAuthDto.email);

    if (!user) {
      throw new UnauthorizedException('Email or password incorrect!');
    }

    const isMatch = await comparePassword(loginAuthDto.password, user.password);
    if (!isMatch)
      throw new UnauthorizedException('Email or password incorrect!');

    const payload: JwtPayload = {
      id: user.id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const { access_token } = this.jwt.singAuth(payload);

    return { access_token };
  }

  async requestCode(type: TypeCode, email: EmailDto) {
    const user = await this.getUserByEmail(email.email);

    if (!user) {
      throw new UnauthorizedException('Email not found!');
    }
    const code = generateCode(type);
    await this.tokenService.createToken(code, email.email);
    await this.email.sendCodeEmail(email.email, code);
    setTimeout(() => this.tokenService.deleteCode(email.email), 15 * 60 * 1000);
    return { message: 'Verification code sent to email.' };
  }

  async verifyCode(email: string, code: string) {
    const codeInBank = await this.tokenService.findByEmail(email);

    if (!codeInBank || codeInBank.token !== code) {
      throw new UnauthorizedException('Invalid verification code!');
    }

    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid verification code!');
    }
    const payload: JwtPayload = {
      id: user.id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const { access_token } = this.jwt.singAuth(payload);

    return { access_token };
  }

  // async createMaster(masterCreatedDto: MasterCreateDto) {
  //   const user = await this.getUserByEmail(masterCreatedDto.email);
  //   if (user) {
  //     throw new BadRequestException('A User with this email already exists');
  //   }

  //   const hashedPassword = await hashPassword(masterCreatedDto.password);

  //   try {
  //     const company = this.companyRepository.create({
  //       name: 'Paladinus SE',
  //       cnpj: '47.161.953/0001-03',
  //       emails: [{ email: masterCreatedDto.email }],
  //       location: 'Joao Pessoa / PB',
  //     });
  //     const savedCompany = await this.companyRepository.save(company);

  //     const userToCreate = this.userRepository.create({
  //       name: masterCreatedDto.name,
  //       email: masterCreatedDto.email,
  //       password: hashedPassword,
  //       role: UserRole.MASTER,
  //       companyId: savedCompany._id.toHexString(),
  //     });

  //     const userCreate = await this.userRepository.save(userToCreate);

  //     this.email.sendWelcomeEmail(userCreate.email, userCreate.name);

  //     return `${userCreate.name} Criado com sucesso !!`;
  //   } catch (err) {
  //     Logger.error('[Erro ao criar master]', err);
  //     throw new BadRequestException('Erro ao criar usuário/master');
  //   }
  // }

  // async createClient(emailToken: EmailPayload, clientDTO: ClientCreateDto) {
  //   const user = await this.getUserByEmail(emailToken.email);
  //   if (user)
  //     throw new BadRequestException('A User with this email already exists');

  //   const company = await this.getCompanyById(emailToken.companyId);
  //   if (!company) throw new BadRequestException('A Company is required!');

  //   const hashedPassword = await hashPassword(clientDTO.password);

  //   try {
  //     const clientToCreate = this.userService.create({
  //       name: clientDTO.name,
  //       email: emailToken.email,
  //       password: hashedPassword,
  //       role: emailToken.role as UserRole,
  //       companyId: emailToken.companyId,
  //     });

  //     const clientCreate = await this.userRepository.save(clientToCreate);

  //     // Atualiza os emails da empresa no MongoDB
  //     if (!company.emails) {
  //       company.emails = [];
  //     }
  //     company.emails.push({ email: emailToken.email });
  //     await this.companyRepository.save(company);

  //     return `${clientCreate.name} Criado com sucesso !!`;
  //   } catch (err) {
  //     Logger.error('Erro ao criar cliente:', err);
  //     throw new InternalServerErrorException(
  //       'Não foi possível criar o cliente.',
  //     );
  //   }
  // }
}
