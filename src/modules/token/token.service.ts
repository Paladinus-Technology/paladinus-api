import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TokenService {
  constructor(private prisma: PrismaService) {}

  async createToken(token: string, email: string) {
    try {
      return await this.prisma.token.upsert({
        where: { email },
        update: { token },
        create: { token, email },
      });
    } catch (error) {
      throw new Error(`Failed to create token: ${error}`);
    }
  }
}
