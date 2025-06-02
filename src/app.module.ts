import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CompanyModule } from './modules/company/company.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CompanyModule,
    UserModule,
    TicketModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
