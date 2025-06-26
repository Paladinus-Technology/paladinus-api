import { Module } from '@nestjs/common';
import { EmailModule } from 'src/common/email/email.module';
import { JwtTokenService } from 'src/common/jwt-token/jwt-token.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [EmailModule],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtTokenService],
})
export class AuthModule {}
