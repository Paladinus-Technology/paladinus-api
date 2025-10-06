import { Injectable } from '@nestjs/common';
import { UserRole } from 'generated/prisma';
import { EmailService } from 'src/common/email/email.service';
import { EmailPayload } from 'src/common/interfaces/EmailPayload';
import { JwtTokenService } from 'src/common/jwt-token/jwt-token.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { InviteClientDto } from './dto/invite-client.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtTokenService,
    private readonly email: EmailService,
  ) {}

  async invite(inviteClient: InviteClientDto, origin: string) {
    const userInvite: EmailPayload = {
      email: inviteClient.email,
      role: UserRole.CLIENT,
      companyId: inviteClient.companyId,
    };
    const { token } = this.jwt.TokenFromEmail(userInvite);

    this.email.inviteEmail(inviteClient.email, token, origin);
  }

  findAll() {
    return this.prisma.user.findMany({ include: { company: true } });
  }
}
