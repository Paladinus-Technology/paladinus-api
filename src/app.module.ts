import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './common/email/email.module';
import { JwtTokenModule } from './common/jwt-token/jwt-token.module';
import { CompanyModule } from './modules/company/company.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtTokenModule,
    CompanyModule,
    UserModule,
    TicketModule,
    AuthModule,
    PrismaModule,
    EmailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
