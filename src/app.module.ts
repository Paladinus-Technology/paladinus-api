import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/guard/auth.guard';
import { EmailModule } from './common/email/email.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { JwtTokenModule } from './common/jwt-token/jwt-token.module';
import { databaseConfig } from './config/database.config';
import { ChatModule } from './modules/chat/chat.module';
import { CompanyModule } from './modules/company/company.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { TokenModule } from './modules/token/token.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: databaseConfig,
    }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 10 }]),
    JwtTokenModule,
    CompanyModule,
    UserModule,
    TicketModule,
    AuthModule,
    EmailModule,
    TokenModule,
    ChatModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
