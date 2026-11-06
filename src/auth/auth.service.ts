import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { EmailService } from 'src/common/email/email.service';
import { TypeCode } from 'src/common/enum/type-code.enum';
import { FinishSignupDto } from 'src/common/interfaces/finishSignup';
import { JwtTokenService } from 'src/common/jwt-token/jwt-token.service';
import { generateCode } from 'src/common/utils/generate-code.util';
import { comparePassword } from 'src/common/utils/hash';
import { CompanyService } from 'src/modules/company/company.service';
import { TokenService } from 'src/modules/token/token.service';
import { UserService } from 'src/modules/user/user.service';
import { ClientCreateDto } from './dto/client-register.dto';
import { EmailDto } from './dto/email.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { JwtPayload } from './jwt/jwt.payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly companyService: CompanyService,
    private readonly jwt: JwtTokenService,
    private readonly email: EmailService,
    private readonly tokenService: TokenService,
  ) {}

  private async getUserByEmail(email: string) {
    return await this.userService.getUserByEmail(email);
  }

  private async getCodeInBank(email: string) {
    return await this.tokenService.findByEmail(email);
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
      id: user._id.toHexString(),
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
    const codeInBank = await this.getCodeInBank(email);

    if (!codeInBank || codeInBank.token !== code) {
      throw new UnauthorizedException('Invalid verification code!');
    }

    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid verification code!');
    }
    const payload: JwtPayload = {
      id: user._id.toHexString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const { access_token } = this.jwt.singAuth(payload);

    await this.tokenService.deleteCode(email);

    return { access_token };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const codeInBank = await this.getCodeInBank(dto.email);
    if (!codeInBank || codeInBank.token !== dto.code) {
      throw new UnauthorizedException('Invalid verification code!');
    }
    await this.userService.resetPassword(dto);
  }

  async createClient(tokenDto: FinishSignupDto, clientDTO: ClientCreateDto) {
    const company = await this.companyService.findOne(tokenDto.companyId);
    if (!company) throw new BadRequestException('A Company is required!');

    await this.userService.createClient(tokenDto, clientDTO);

    const currentEmails = Array.isArray(company.emails) ? company.emails : [];
    await this.companyService.update(tokenDto.companyId, {
      emails: [...currentEmails, tokenDto.email],
    });

    return { message: 'Client created successfully' };
  }

  async verifyTokenFinishSignup(token: string) {
    const payload = this.jwt.verifyTokenFinishSignup(token);
    return payload;
  }
  // private getCompanyById(id: string) {
  //   return this.companyRepository.findOne({
  //     where: { _id: new ObjectId(id) },
  //   });
  // }
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
}
