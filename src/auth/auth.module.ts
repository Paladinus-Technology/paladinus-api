import { Module } from '@nestjs/common';
import { EmailModule } from 'src/common/email/email.module';
import { JwtTokenService } from 'src/common/jwt-token/jwt-token.service';
import { CompanyModule } from 'src/modules/company/company.module';
import { TokenModule } from 'src/modules/token/token.module';
import { UserModule } from 'src/modules/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UserModule, CompanyModule, TokenModule, EmailModule],
  controllers: [AuthController],
  providers: [AuthService, JwtTokenService],
})
export class AuthModule {}
