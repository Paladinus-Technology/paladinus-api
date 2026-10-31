import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from 'src/common/email/email.service';
import { UserRole } from 'src/common/enum/user-role.enum';
import { EmailPayload } from 'src/common/interfaces/EmailPayload';
import { JwtTokenService } from 'src/common/jwt-token/jwt-token.service';
import { Repository } from 'typeorm';
import { InviteClientDto } from './dto/invite-client.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
    const users = await this.userRepository.find();

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
    {
      const user = await this.userRepository.findOneBy({ email });

      if (!user || user === null) {
        throw new BadRequestException(
          'Usuário não encontrado no banco de dados',
        );
      }
      return user;
    }
  }
}
