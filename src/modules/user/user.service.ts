import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ClientCreateDto } from 'src/auth/dto/client-register.dto';
import { ResetPasswordDto } from 'src/auth/dto/resetPassword.dto';
import { EmailService } from 'src/common/email/email.service';
import { UserRole } from 'src/common/enum/user-role.enum';
import { EmailPayload } from 'src/common/interfaces/EmailPayload';
import { JwtTokenService } from 'src/common/jwt-token/jwt-token.service';
import { hashPassword } from 'src/common/utils/hash';
import { InviteClientDto } from './dto/invite-client.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwt: JwtTokenService,
    private readonly email: EmailService,
  ) {}

  async invite(inviteClient: InviteClientDto, origin: string) {
    const userInvite: EmailPayload = {
      email: inviteClient.email,
      role: UserRole.CLIENT,
      companyId: inviteClient.companyId,
    };
    const { token } = this.jwt.TokenInviteEmail(userInvite);

    this.email.inviteEmail(inviteClient.email, token, origin);
  }

  async findAll() {
    const users = await this.userRepository.findAll();

    const usersWithCompany = await Promise.all(
      users.map(async (user) => {
        let company = null;
        if (user.companyId) {
          // try {
          //   company = await this.companyRepository.findOneBy({
          //     _id: new ObjectId(user.companyId),
          //   } as any);
          // } catch (e) {
          // }
        }
        return {
          ...user,
          company,
        };
      }),
    );

    return usersWithCompany;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new BadRequestException('Usuário não encontrado no banco de dados');
    }
    return user;
  }

  async resetPassword({ email, password }: ResetPasswordDto) {
    const user = await this.getUserByEmail(email);

    const newPassword = await hashPassword(password);

    await this.userRepository.updatePassword(
      user._id.toHexString(),
      newPassword,
    );
    return { message: 'Senha atualizada com sucesso' };
  }

  async createClient(emailToken: EmailPayload, clientDTO: ClientCreateDto) {
    const existingUser = await this.userRepository.findByEmail(
      emailToken.email,
    );
    if (existingUser) {
      throw new BadRequestException(
        'Este e-mail já está cadastrado no sistema.',
      );
    }

    const hashedPassword = await hashPassword(clientDTO.password);

    try {
      await this.userRepository.createAndSave({
        name: clientDTO.name,
        email: emailToken.email,
        password: hashedPassword,
        role: emailToken.role as UserRole,
        companyId: emailToken.companyId,
      });
    } catch (err) {
      Logger.error('Erro ao criar cliente:', err);
      throw new InternalServerErrorException(
        'Não foi possível criar o cliente.',
      );
    }
  }
}
