import { Module } from '@nestjs/common';
import { EmailService } from 'src/common/email/email.service';
import { JwtTokenService } from 'src/common/jwt-token/jwt-token.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, EmailService, JwtTokenService],
})
export class UserModule {}
